import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Request, Response } from 'express';
import { sendResponse } from 'src/helpers/response';

export class CheckInDto {
  notes?: string;
}

@Controller('attendances')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(
    @Req() req: Request,
    @Body() dto: CheckInDto,
    @Res() res: Response,
  ) {
    const user = req['user']; // Logged in user / student from AuthMiddleware / Guard
    const studentUuid = user?.uuid;

    if (!studentUuid) {
      return sendResponse(
        res,
        400,
        'Student identity not found in request',
        null,
      );
    }

    const attendance = await this.attendanceService.doStudentAttendance({
      studentUuid,
      notes: dto.notes,
    });

    return sendResponse(
      res,
      200,
      'Attendance recorded successfully',
      attendance,
    );
  }
}
