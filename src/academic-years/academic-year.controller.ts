import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AcademicYearService } from './academic-year.service';
import { AuthUserPayload } from 'src/auth/dto/auth.dto';
import { AuthUser } from 'src/decorators/auth.decorator';
import {
  AcademicYearType,
  CreateAcademicYearDto,
  DeleteAcademicYearDto,
  mappingAcademicYear,
  UpdateAcademicYearDto,
} from './dto/academic-year.dto';
import { sendResponse } from 'src/helpers/response';
import { Response } from 'express';
import { PolicyGuard } from 'src/guards/policy.guard';
import { Policy } from 'src/decorators/policy.decorator';
import { AcademicYearPolicy } from 'src/policies/academic-year.policy';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';

@Controller('academic-years')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Get()
  @Roles('Super Admin')
  @UseGuards(RolesGuard)
  async findAllBySchoolId(
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    console.log(user);
    const academicYears = await this.academicYearService.getAllBySchoolId(
      user.school?.id ?? 0,
    );
    return sendResponse<AcademicYearType[]>(
      res,
      200,
      'Academic years retrieved successfully',
      academicYears.map(mappingAcademicYear),
    );
  }

  @Post()
  @Roles('Super Admin')
  @UseGuards(RolesGuard)
  async create(
    @Body() createAcademicYearDto: CreateAcademicYearDto,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const newAcademicYear = await this.academicYearService.create({
      ...createAcademicYearDto,
      school_id: user.school?.id ?? 0,
      is_active: true,
    });
    return sendResponse(res, 201, 'Academic year created successfully', newAcademicYear);
  }

  @Patch()
  @Roles('Super Admin')
  @UseGuards(PolicyGuard, RolesGuard)
  @Policy(AcademicYearPolicy, 'update', 'id', AcademicYearService)
  async update(
    @Body() updateAcademicYearDto: UpdateAcademicYearDto,
    @Res() res: Response,
  ) {
    await this.academicYearService.update(updateAcademicYearDto);
    return sendResponse(res, 200, 'Academic year updated successfully', null);
  }

  @Delete()
  @Roles('Super Admin')
  @UseGuards(PolicyGuard, RolesGuard)
  @Policy(AcademicYearPolicy, 'delete', 'id', AcademicYearService)
  async delete(
    @Body() deleteAcademicYearDto: DeleteAcademicYearDto,
    @Res() res: Response,
  ) {
    await this.academicYearService.delete(deleteAcademicYearDto.id);
    return sendResponse(res, 200, 'Academic year deleted successfully', null);
  }
}
