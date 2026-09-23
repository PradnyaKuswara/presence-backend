import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AcademicYearService } from './academic-year.service';
import { AuthUserPayload } from 'src/auth/dto/auth.dto';
import { AuthUser } from 'src/decorators/auth.decorator';
import {
  AcademicYearPaginatedResponseDto,
  AcademicYearQueryDto,
  AcademicYearType,
  CreateAcademicYearDto,
  mappingAcademicYear,
  UpdateAcademicYearDto,
} from './dto/academic-year.dto';
import { sendResponse } from 'src/helpers/response';
import { Response } from 'express';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { ROLE } from 'src/constants/roleConstant';

@Controller('academic-years')
@UseGuards(RolesGuard)
@Roles(ROLE.SUPER_ADMIN_GLOBAL, ROLE.SUPER_ADMIN)
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Get()
  async findAll(
    @Query() query: AcademicYearQueryDto,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const result = await this.academicYearService.findAll(query, user);
    return sendResponse<AcademicYearPaginatedResponseDto>(
      res,
      200,
      'Academic years retrieved successfully',
      result,
    );
  }

  @Get('deleted')
  async findDeleted(
    @Query() query: AcademicYearQueryDto,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const result = await this.academicYearService.findDeleted(query, user);
    return sendResponse<AcademicYearPaginatedResponseDto>(
      res,
      200,
      'Deleted academic years retrieved successfully',
      result,
    );
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string, @Res() res: Response) {
    const restored = await this.academicYearService.restore(Number(id));
    return sendResponse<AcademicYearType>(
      res,
      200,
      'Academic year restored successfully',
      mappingAcademicYear(restored),
    );
  }

  @Post(':id/set-active')
  async setActive(
    @Param('id') id: string,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const active = await this.academicYearService.setActive(Number(id), user);
    return sendResponse<AcademicYearType>(
      res,
      200,
      'Academic year set as active successfully',
      mappingAcademicYear(active),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const item = await this.academicYearService.getById(Number(id));
    return sendResponse<AcademicYearType>(
      res,
      200,
      'Academic year retrieved successfully',
      mappingAcademicYear(item!),
    );
  }

  @Post()
  async create(
    @Body() dto: CreateAcademicYearDto,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const newAcademicYear = await this.academicYearService.create(dto, user);
    return sendResponse<AcademicYearType>(
      res,
      201,
      'Academic year created successfully',
      mappingAcademicYear(newAcademicYear),
    );
  }

  @Put(':id')
  async updatePut(
    @Param('id') id: string,
    @Body() dto: UpdateAcademicYearDto,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const updated = await this.academicYearService.update(
      Number(id),
      dto,
      user,
    );
    return sendResponse<AcademicYearType>(
      res,
      200,
      'Academic year updated successfully',
      mappingAcademicYear(updated),
    );
  }

  @Patch(':id')
  async updatePatch(
    @Param('id') id: string,
    @Body() dto: UpdateAcademicYearDto,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const updated = await this.academicYearService.update(
      Number(id),
      dto,
      user,
    );
    return sendResponse<AcademicYearType>(
      res,
      200,
      'Academic year updated successfully',
      mappingAcademicYear(updated),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.academicYearService.delete(Number(id));
    return sendResponse(res, 200, 'Academic year deleted successfully', null);
  }
}
