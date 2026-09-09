import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { StudentModule } from 'src/students/student.module';
import { StudentClassHistoryModule } from 'src/student-class-histories/student-class-history.module';
import { SettingModule } from 'src/settings/setting.module';
import { AttendanceSessionModule } from 'src/attendance-sessions/attendance-session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    StudentModule,
    StudentClassHistoryModule,
    SettingModule,
    AttendanceSessionModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
