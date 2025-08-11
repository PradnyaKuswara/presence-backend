import { Module } from '@nestjs/common';
import { Attendance } from './entities/attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AttendanceModule {}
