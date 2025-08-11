import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceSession } from './entities/attendance-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceSession])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AttendanceSessionModule {}
