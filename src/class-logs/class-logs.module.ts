import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassLog } from './entities/class-log.entity';
import { ClassLogService } from './class-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClassLog])],
  providers: [ClassLogService],
  exports: [ClassLogService],
})
export class ClassLogModule {}
