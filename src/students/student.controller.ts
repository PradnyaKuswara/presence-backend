import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { StudentService } from './student.service';
import {
  CreateStudentDto,
  mappingStudent,
  StudentType,
} from './dto/student.dto';
import { AuthUser } from 'src/decorators/auth.decorator';
import { AuthUserPayload } from 'src/auth/dto/auth.dto';
import { Response } from 'express';
import { sendResponse } from 'src/helpers/response';

@Controller('students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  async getStudentsBySchool(
    @AuthUser() user: AuthUserPayload,
    @Res() res: Response,
  ) {
    const students = await this.studentService.findBySchoolId(user.school.id);
    return sendResponse<StudentType[]>(
      res,
      200,
      'successfully get students',
      students.map(mappingStudent),
    );
  }

  @Get('histories')
  async getStudentsWithHistoriesBySchool(
    @AuthUser() user: AuthUserPayload,
    @Res() res: Response,
  ) {
    const students = await this.studentService.findBySchoolIdWithHistories(
      user.school.id,
    );

    console.log(students);
    return sendResponse<StudentType[]>(
      res,
      200,
      'successfully get students with histories',
      students.map(mappingStudent),
    );
  }

  @Post()
  async createStudent(
    @Body() input: CreateStudentDto,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const student = await this.studentService.create({
      ...input,
      student_class_history: {
        ...input.student_class_history,
        school_id: user.school.id,
      },
    });
    return sendResponse<StudentType>(
      res,
      201,
      'successfully created student',
      student,
    );
  }
}
