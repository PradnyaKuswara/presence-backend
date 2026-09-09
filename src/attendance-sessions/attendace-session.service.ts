import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceSession } from './entities/attendance-session.entity';
import { Repository } from 'typeorm';
import {
  AttendanceSessionCreateInput,
  AttendanceSessionUpdateInput,
} from './dto/attendance.dto';

@Injectable()
export class AttendanceSessionService {
  constructor(
    @InjectRepository(AttendanceSession)
    private attendanceSessionRepository: Repository<AttendanceSession>,
  ) {}

  async findAllBySchoolId(schoolId: number): Promise<AttendanceSession[]> {
    return this.attendanceSessionRepository.find({
      where: { school_id: schoolId },
    });
  }

  async findOneById(id: number): Promise<AttendanceSession | null> {
    return this.attendanceSessionRepository.findOne({ where: { id } });
  }

  async findActiveSession(
    schoolId: number,
    classId: number,
    currentTime: string,
  ): Promise<AttendanceSession | null> {
    return this.attendanceSessionRepository
      .createQueryBuilder('session')
      .where('session.school_id = :schoolId', { schoolId })
      .andWhere(
        '(session.class_id = :classId OR session.class_id IS NULL)',
        { classId },
      )
      .andWhere('session.start_time <= :currentTime', { currentTime })
      .andWhere('session.end_time >= :currentTime', { currentTime })
      .getOne();
  }

  async create(
    input: AttendanceSessionCreateInput,
  ): Promise<AttendanceSession> {
    const newSession = this.attendanceSessionRepository.create(input);
    return this.attendanceSessionRepository.save(newSession);
  }

  async update(
    input: AttendanceSessionUpdateInput,
  ): Promise<AttendanceSession | null> {
    const session = await this.attendanceSessionRepository.findOne({
      where: { id: input.id },
    });
    if (!session) {
      return null;
    }
    Object.assign(session, input);
    return this.attendanceSessionRepository.save(session);
  }

  async delete(id: number): Promise<void> {
    await this.attendanceSessionRepository.delete(id);
  }
}
