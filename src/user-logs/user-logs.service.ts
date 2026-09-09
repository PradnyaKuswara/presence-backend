import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLog } from './entities/user-log.entity';

export interface CreateUserLogParams {
  user_id?: number;
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
export class UserLogService {
  constructor(
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,
  ) {}

  async log(params: CreateUserLogParams): Promise<UserLog> {
    const userLog = this.userLogRepository.create(params);
    return await this.userLogRepository.save(userLog);
  }
}
