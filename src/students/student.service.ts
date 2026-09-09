import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import {
  StudentCreateInput,
  StudentUpdateInput,
  UpdateStudentStatusDto,
} from './dto/student.dto';
import { Transactional } from 'typeorm-transactional';
import { StudentClassHistoryService } from 'src/student-class-histories/student-class-history.service';
import { encrypt } from 'src/helpers/hash';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private studentClassHistoryService: StudentClassHistoryService,
  ) {}

  findByEmail(email: string): Promise<Student | null> {
    return this.studentRepository.findOne({
      where: { email },
    });
  }

  findByUuid(uuid: string): Promise<Student | null> {
    return this.studentRepository.findOne({
      where: { uuid },
    });
  }

  findBySchoolId(schoolId: number): Promise<Student[]> {
    return this.studentRepository
      .createQueryBuilder('student')
      .leftJoin('student.student_class_histories', 'history')
      .where('history.school_id = :schoolId', { schoolId })
      .orderBy('student.created_at', 'DESC')
      .getMany();
  }

  findBySchoolIdWithHistories(schoolId: number): Promise<Student[]> {
    return this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.student_class_histories', 'history')
      .leftJoinAndSelect('history.class', 'class')
      .leftJoinAndSelect('history.academic_year', 'academic_year')
      .where('history.school_id = :schoolId', { schoolId })
      .orderBy('student.created_at', 'DESC')
      .getMany();
  }

  @Transactional()
  async create(input: StudentCreateInput): Promise<Student> {
    console.log(input);
    const { student_class_history, ...studentData } = input;
    const student = this.studentRepository.create({
      ...studentData,
      password: await encrypt(input.password),
    });
    const savedStudent = await this.studentRepository.save(student);

    await this.studentClassHistoryService.create({
      ...student_class_history,
      student_id: savedStudent.id,
      is_active: true,
    });

    return savedStudent;
  }

  @Transactional()
  async update(input: StudentUpdateInput): Promise<void> {
    const { uuid, student_class_history, ...rest } = input;

    const exist = await this.findByUuid(uuid);
    if (!exist) {
      throw new NotFoundException('Student not found');
    }

    await this.studentRepository.update({ uuid }, rest);

    if (student_class_history) {
      const latestHistory =
        await this.studentClassHistoryService.findLatestByStudentId(exist.id);
      if (latestHistory) {
        await this.studentClassHistoryService.update({
          ...student_class_history,
          id: latestHistory.id,
          student_id: exist.id,
          is_active: latestHistory.is_active,
        });
      } else {
        await this.studentClassHistoryService.create({
          ...student_class_history,
          student_id: exist.id,
          is_active: true,
        });
      }
    }
  }

  async updateStatus(input: UpdateStudentStatusDto): Promise<void> {
    const { uuid, is_active: isActive } = input;
    const exist = await this.findByUuid(uuid);
    if (!exist) {
      throw new NotFoundException('Student not found');
    }

    console.log(exist);

    const latestHistory =
      await this.studentClassHistoryService.findLatestByStudentId(exist.id);

    console.log(latestHistory);

    if (!latestHistory) throw new Error('Student class history not found');

    await this.studentClassHistoryService.updateIsActiveById(
      latestHistory.id,
      isActive,
    );
  }

  async updatePassword(id: number, password: string): Promise<void> {
    await this.studentRepository.update(id, { password });
  }
}
