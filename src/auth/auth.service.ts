import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, encrypt } from 'src/helpers/hash';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RoleService } from 'src/roles/role.service';
import { SchoolService } from 'src/schools/school.service';
import { Transactional } from 'typeorm-transactional';
import { UserInput } from 'src/users/dto/user.dto';
import { Student } from 'src/students/entities/student.entity';
import { StudentService } from 'src/students/student.service';
import { StudentClassHistoryService } from 'src/student-class-histories/student-class-history.service';
import { ROLE } from 'src/constants/roleConstant';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private schoolService: SchoolService,
    private studentService: StudentService,
    private studentClassHistoriyesService: StudentClassHistoryService,
    private jwtService: JwtService,
  ) {}

  async validateUser(input: LoginDto): Promise<User> {
    const user = await this.userService.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async validateStudent(input: LoginDto): Promise<Student> {
    const student = await this.studentService.findByEmail(input.email);
    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const student_last_history =
      await this.studentClassHistoriyesService.findLatestByStudentId(
        student.id,
      );

    if (!student_last_history || !student_last_history.is_active) {
      throw new UnauthorizedException('Student is not active');
    }

    if (student.email && student.password) {
      const isPasswordValid = await compare(input.password, student.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      if (input.password !== 'studentdefaultpassword') {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
    return student;
  }

  login(USER: User): { access_token: string } {
    const payload = {
      uuid: USER.uuid,
      email: USER.email,
      fullName: USER.full_name,
      role: {
        id: USER.role.id,
        name: USER.role.name,
      },
      school: USER.school,
      isActive: USER.isActive,
      isEmailVerified: USER.isEmailVerified,
      avatar: USER.avatar,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginStudent(student: Student): Promise<{ access_token: string }> {
    const student_last_history =
      await this.studentClassHistoriyesService.findLatestByStudentId(
        student.id,
      );

    if (!student_last_history || !student_last_history.is_active) {
      throw new UnauthorizedException('Student is not active');
    }

    const payload = {
      uuid: student.uuid,
      email: student.email,
      fullName: student.full_name,
      role: {
        id: 0,
        name: ROLE.STUDENT,
      },
      school: student_last_history.school,
      isActive: student_last_history?.is_active,
      isEmailVerified: !!student.email,
      avatar: student.avatar,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  @Transactional()
  async register(input: RegisterDto): Promise<User> {
    const school = await this.schoolService.create(input.school);
    const role = await this.roleService.findByName('Super Admin');

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const constructedInput: UserInput = {
      ...input.user,
      password: await encrypt(input.user.password),
      role_id: role.id,
      school_id: school.id,
    };

    const created = await this.userService.create(constructedInput);
    const user = await this.userService.findById(created.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
