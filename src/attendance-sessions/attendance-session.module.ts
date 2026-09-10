import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceSession } from './entities/attendance-session.entity';
import { AttendanceSessionService } from './attendace-session.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceSession])],
  controllers: [],
  providers: [AttendanceSessionService],
  exports: [AttendanceSessionService],
})
export class AttendanceSessionModule {}
