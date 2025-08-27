import { Module } from '@nestjs/common';
import { StudentClassHistory } from './entities/student-class-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentClassHistoryService } from './student-class-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentClassHistory])],
  controllers: [],
  providers: [StudentClassHistoryService],
  exports: [StudentClassHistoryService],
})
export class StudentClassHistoryModule {}
