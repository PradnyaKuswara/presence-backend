import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentLog } from './entities/student-log.entity';
import { StudentLogService } from './student-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentLog])],
  providers: [StudentLogService],
  exports: [StudentLogService],
})
export class StudentLogModule {}
