import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  CreateStudentDto,
  mappingStudent,
  StudentType,
  UpdateStudentDto,
  UpdateStudentStatusDto,
} from './dto/student.dto';
import { AuthUser } from 'src/decorators/auth.decorator';
import { AuthUserPayload } from 'src/auth/dto/auth.dto';
import { Response } from 'express';
import { sendResponse } from 'src/helpers/response';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { ROLE } from 'src/constants/roleConstant';

@Controller('students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  @Roles(ROLE.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async getStudentsBySchool(
    @AuthUser() user: AuthUserPayload,
    @Res() res: Response,
  ) {
    const students = await this.studentService.findBySchoolId(
      user.school?.id ?? 0,
    );
    return sendResponse<StudentType[]>(
      res,
      200,
      'Students retrieved successfully',
      students.map(mappingStudent),
    );
  }

  @Get('histories')
  @Roles(ROLE.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async getStudentsWithHistoriesBySchool(
    @AuthUser() user: AuthUserPayload,
    @Res() res: Response,
  ) {
    const students = await this.studentService.findBySchoolIdWithHistories(
      user.school?.id ?? 0,
    );

    console.log(students);
    return sendResponse<StudentType[]>(
      res,
      200,
      'Students with histories retrieved successfully',
      students.map(mappingStudent),
    );
  }

  @Post()
  @Roles(ROLE.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async createStudent(
    @Body() input: CreateStudentDto,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const student = await this.studentService.create({
      ...input,
      school_id: user.school?.id ?? 0,
      student_class_history: {
        ...input.student_class_history,
        school_id: user.school?.id ?? 0,
      },
    });

    return sendResponse<StudentType>(
      res,
      201,
      'Student created successfully',
      mappingStudent(student),
    );
  }

  @Patch()
  @Roles(ROLE.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async updateStudent(
    @Body() input: UpdateStudentDto,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    await this.studentService.update({
      ...input,
      student_class_history: input.student_class_history
        ? {
            ...input.student_class_history,
            school_id: user.school?.id ?? 0,
          }
        : undefined,
    });
    return sendResponse(res, 200, 'Student updated successfully', null);
  }

  @Patch('/status')
  @Roles(ROLE.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async updateStatus(
    @Body() input: UpdateStudentStatusDto,
    @Res() res: Response,
  ) {
    console.log(input);
    await this.studentService.updateStatus(input);
    return sendResponse(res, 200, 'Student status updated successfully', null);
  }
}
