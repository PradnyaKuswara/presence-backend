import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentClassHistory } from './entities/student-class-history.entity';
import { Repository } from 'typeorm';
import { StudentClassHistoryInput } from './dto/student-class-history.dto';

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
      relations: ['student', 'class'],
    });
  }

  async create(input: StudentClassHistoryInput): Promise<StudentClassHistory> {
    const newHistory = this.studentClassHistoryRepository.create(input);
    return this.studentClassHistoryRepository.save(newHistory);
  }
}
