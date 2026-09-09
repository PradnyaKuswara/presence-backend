import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository, IsNull } from 'typeorm';
import { StudentService } from 'src/students/student.service';
import { StudentClassHistoryService } from 'src/student-class-histories/student-class-history.service';
import { SettingService } from 'src/settings/setting.service';
import { AttendanceSessionService } from 'src/attendance-sessions/attendace-session.service';
import { AttendanceType } from 'src/enums/attendance-type.enum';
import { AttendanceStatus } from 'src/enums/attendance-status.enum';
import { Transactional } from 'typeorm-transactional';

export interface DoAttendanceDto {
  studentUuid: string;
  notes?: string;
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private studentService: StudentService,
    private studentClassHistoryService: StudentClassHistoryService,
    private settingService: SettingService,
    private attendanceSessionService: AttendanceSessionService,
  ) {}

  @Transactional()
  async doStudentAttendance(dto: DoAttendanceDto): Promise<Attendance> {
    const student = await this.studentService.findByUuid(dto.studentUuid);
    if (!student) {
      throw new NotFoundException('Student data not found');
    }

    const latestHistory =
      await this.studentClassHistoryService.findLatestByStudentId(student.id);

    if (!latestHistory || !latestHistory.is_active) {
      throw new BadRequestException(
        'Student is not registered in an active class for the current academic year',
      );
    }

    const schoolId = latestHistory.school_id;
    const classId = latestHistory.class_id;
    const setting = await this.settingService.getSettingBySchoolId(schoolId);

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().split(' ')[0]; // HH:mm:ss

    if (setting.attendanceType === AttendanceType.DAILY) {
      return this.handleDailyAttendance({
        historyId: latestHistory.id,
        settingCheckIn: setting.checkIn,
        currentDate,
        currentTime,
        notes: dto.notes,
      });
    } else {
      return this.handleSessionAttendance({
        schoolId,
        classId,
        historyId: latestHistory.id,
        currentDate,
        currentTime,
        notes: dto.notes,
      });
    }
  }

  private async handleDailyAttendance(params: {
    historyId: number;
    settingCheckIn: string;
    currentDate: string;
    currentTime: string;
    notes?: string;
  }): Promise<Attendance> {
    const { historyId, settingCheckIn, currentDate, currentTime, notes } =
      params;

    let existingAttendance = await this.attendanceRepository.findOne({
      where: {
        student_class_history_id: historyId,
        attendance_date: currentDate,
        attendance_session_id: IsNull(),
      },
    });

    if (!existingAttendance) {
      // Perform Check-in
      const status =
        currentTime > settingCheckIn
          ? AttendanceStatus.LATE
          : AttendanceStatus.PRESENT;

      existingAttendance = this.attendanceRepository.create({
        student_class_history_id: historyId,
        attendance_date: currentDate,
        attendance_session_id: null,
        check_in: currentTime,
        status,
        notes,
      });

      return await this.attendanceRepository.save(existingAttendance);
    }

    if (!existingAttendance.check_out) {
      // Perform Check-out
      existingAttendance.check_out = currentTime;
      if (notes) existingAttendance.notes = notes;
      return await this.attendanceRepository.save(existingAttendance);
    }

    return existingAttendance;
  }

  private async handleSessionAttendance(params: {
    schoolId: number;
    classId: number;
    historyId: number;
    currentDate: string;
    currentTime: string;
    notes?: string;
  }): Promise<Attendance> {
    const { schoolId, classId, historyId, currentDate, currentTime, notes } =
      params;

    const activeSession = await this.attendanceSessionService.findActiveSession(
      schoolId,
      classId,
      currentTime,
    );

    if (!activeSession) {
      throw new BadRequestException(
        'There is no active attendance session for your class at this time',
      );
    }

    let existingAttendance = await this.attendanceRepository.findOne({
      where: {
        student_class_history_id: historyId,
        attendance_date: currentDate,
        attendance_session_id: activeSession.id,
      },
    });

    if (!existingAttendance) {
      const status =
        currentTime > activeSession.start_time
          ? AttendanceStatus.LATE
          : AttendanceStatus.PRESENT;

      existingAttendance = this.attendanceRepository.create({
        student_class_history_id: historyId,
        attendance_date: currentDate,
        attendance_session_id: activeSession.id,
        check_in: currentTime,
        status,
        notes,
      });

      return await this.attendanceRepository.save(existingAttendance);
    }

    if (!existingAttendance.check_out) {
      existingAttendance.check_out = currentTime;
      if (notes) existingAttendance.notes = notes;
      return await this.attendanceRepository.save(existingAttendance);
    }

    return existingAttendance;
  }

  async findByStudentHistory(historyId: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { student_class_history_id: historyId },
      relations: ['attendance_session'],
      order: { attendance_date: 'DESC' },
    });
  }
}
