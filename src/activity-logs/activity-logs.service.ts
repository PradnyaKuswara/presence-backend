import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-logs.entity';
import { ActivityAction } from 'src/enums/activity-action.enum';

export interface CreateActivityLogParams {
  action: ActivityAction;
  user_id?: number;
  student_id?: number;
  metadata?: {
    description?: string;
    before?: unknown;
    after?: unknown;
  };
  ip_address?: string;
  device?: string;
}

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async log(params: CreateActivityLogParams): Promise<ActivityLog> {
    const activityLog = this.activityLogRepository.create(params);
    return await this.activityLogRepository.save(activityLog);
  }
}
