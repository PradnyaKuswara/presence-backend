import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentClassHistory } from './entities/student-class-history.entity';
import { Repository } from 'typeorm';
import {
  StudentClassHistoryInput,
  StudentClassHistoryUpdateInput,
} from './dto/student-class-history.dto';

@Injectable()
export class StudentClassHistoryService {
  constructor(
    @InjectRepository(StudentClassHistory)
    private studentClassHistoryRepository: Repository<StudentClassHistory>,
  ) {}

  findLatestByStudentId(
    studentId: number,
  ): Promise<StudentClassHistory | null> {
    return this.studentClassHistoryRepository.findOne({
      where: { student: { id: studentId } },
      order: { created_at: 'DESC' },
      relations: ['student', 'class', 'school'],
    });
  }

  async create(input: StudentClassHistoryInput): Promise<StudentClassHistory> {
    const newHistory = this.studentClassHistoryRepository.create(input);
    return this.studentClassHistoryRepository.save(newHistory);
  }

  async update(input: StudentClassHistoryUpdateInput): Promise<void> {
    const { id, ...rest } = input;
    await this.studentClassHistoryRepository.update(id, rest);
  }

  async updateIsActiveByStudentId(
    studentId: number,
    isActive: boolean,
  ): Promise<void> {
    await this.studentClassHistoryRepository
      .createQueryBuilder()
      .update(StudentClassHistory)
      .set({ is_active: isActive })
      .where('student_id = :studentId', { studentId })
      .andWhere('is_active = :isActive', { isActive: !isActive })
      .execute();

    return;
  }

  async updateIsActiveById(id: number, isActive: boolean): Promise<void> {
    console.log(id, isActive);
    await this.studentClassHistoryRepository.update(
      { id },
      {
        is_active: isActive,
      },
    );
    return;
  }
}
