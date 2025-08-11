import { Module } from '@nestjs/common';
import { StudentClassHistory } from './entities/student-class-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

Module({
  imports: [TypeOrmModule.forFeature([StudentClassHistory])],
  controllers: [],
  providers: [],
  exports: [],
});
export class StudentClassHistoryModule {}
