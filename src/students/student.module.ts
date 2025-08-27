import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentClassHistoryModule } from 'src/student-class-histories/student-class-history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), StudentClassHistoryModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
