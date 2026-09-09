import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassLog } from './entities/class-log.entity';

export interface CreateClassLogParams {
  class_id?: number;
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
export class ClassLogService {
  constructor(
    @InjectRepository(ClassLog)
    private readonly classLogRepository: Repository<ClassLog>,
  ) {}

  async log(params: CreateClassLogParams): Promise<ClassLog> {
    const classLog = this.classLogRepository.create(params);
    return await this.classLogRepository.save(classLog);
  }
}
