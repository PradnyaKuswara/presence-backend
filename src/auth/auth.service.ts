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
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RoleService } from 'src/roles/role.service';
import { SchoolService } from 'src/schools/school.service';
import { Transactional } from 'typeorm-transactional';
import { UserInput } from 'src/users/dto/user.dto';
import { Student } from 'src/students/entities/student.entity';
import { StudentService } from 'src/students/student.service';
import { StudentClassHistoryService } from 'src/student-class-histories/student-class-history.service';
import { ROLE } from 'src/constants/roleConstant';
import { ActivityLogService } from 'src/activity-logs/activity-logs.service';
import { ActivityAction } from 'src/enums/activity-action.enum';

export interface RequestContextInfo {
  ip?: string;
  device?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private schoolService: SchoolService,
    private studentService: StudentService,
    private studentClassHistoriyesService: StudentClassHistoryService,
    private jwtService: JwtService,
    private activityLogService: ActivityLogService,
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

  async login(
    USER: User,
    reqInfo?: RequestContextInfo,
  ): Promise<{ access_token: string }> {
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

    await this.activityLogService.log({
      action: ActivityAction.LOGIN,
      user_id: USER.id,
      metadata: { description: `User ${USER.email} logged in successfully` },
      ip_address: reqInfo?.ip,
      device: reqInfo?.device,
    });

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginStudent(
    student: Student,
    reqInfo?: RequestContextInfo,
  ): Promise<{ access_token: string }> {
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

    await this.activityLogService.log({
      action: ActivityAction.LOGIN,
      student_id: student.id,
      metadata: {
        description: `Student ${student.full_name} (${student.nisn}) logged in successfully`,
      },
      ip_address: reqInfo?.ip,
      device: reqInfo?.device,
    });

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  @Transactional()
  async register(
    input: RegisterDto,
    reqInfo?: RequestContextInfo,
  ): Promise<User> {
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

    await this.activityLogService.log({
      action: ActivityAction.REGISTER,
      user_id: user.id,
      metadata: {
        description: `User ${user.email} registered school ${school.name}`,
      },
      ip_address: reqInfo?.ip,
      device: reqInfo?.device,
    });

    return user;
  }

  async resetPassword(
    input: ResetPasswordDto,
    reqInfo?: RequestContextInfo,
  ): Promise<void> {
    const user = await this.userService.findByEmail(input.email);
    if (user) {
      const hashedPassword = await encrypt(input.newPassword);
      await this.userService.updatePassword(user.id, hashedPassword);

      await this.activityLogService.log({
        action: ActivityAction.RESET_PASSWORD,
        user_id: user.id,
        metadata: {
          description: `Password reset successfully for user ${user.email}`,
        },
        ip_address: reqInfo?.ip,
        device: reqInfo?.device,
      });
      return;
    }

    const student = await this.studentService.findByEmail(input.email);
    if (student) {
      const hashedPassword = await encrypt(input.newPassword);
      await this.studentService.updatePassword(student.id, hashedPassword);

      await this.activityLogService.log({
        action: ActivityAction.RESET_PASSWORD,
        student_id: student.id,
        metadata: {
          description: `Password reset successfully for student ${student.email}`,
        },
        ip_address: reqInfo?.ip,
        device: reqInfo?.device,
      });
      return;
    }

    throw new NotFoundException('Account not found with provided email');
  }
}
