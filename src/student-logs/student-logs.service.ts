import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentLog } from './entities/student-log.entity';

export interface CreateStudentLogParams {
  student_id?: number;
  performed_by_id?: number;
  action: string;
  metadata?: {
    description?: string;
    before?: unknown;
    after?: unknown;
    [key: string]: any;
  };
  ip_address?: string;
  device?: string;
}

@Injectable()
export class StudentLogService {
  constructor(
    @InjectRepository(StudentLog)
    private readonly studentLogRepository: Repository<StudentLog>,
  ) {}

  async log(params: CreateStudentLogParams): Promise<StudentLog> {
    const studentLog = this.studentLogRepository.create(params);
    return await this.studentLogRepository.save(studentLog);
  }
}
