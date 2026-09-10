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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SchoolService } from './school.service';
import {
  CreateSchoolDto,
  SchoolPaginatedResponseDto,
  SchoolQueryDto,
  SchoolType,
  UpdateSchoolDto,
  mappingSchool,
} from './dto/school.dto';
import { sendResponse } from 'src/helpers/response';
import { SuperAdminGlobalGuard } from 'src/guards/super-admin-global.guard';
import { Roles } from 'src/decorators/role.decorator';
import { ROLE } from 'src/constants/roleConstant';

@Controller('schools')
@UseGuards(SuperAdminGlobalGuard)
@Roles(ROLE.SUPER_ADMIN_GLOBAL)
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  async findAll(@Query() query: SchoolQueryDto, @Res() res: Response) {
    const result = await this.schoolService.findAll(query);
    return sendResponse<SchoolPaginatedResponseDto>(
      res,
      200,
      'Schools retrieved successfully',
      result,
    );
  }

  @Get('deleted')
  async findDeleted(@Query() query: SchoolQueryDto, @Res() res: Response) {
    const result = await this.schoolService.findDeleted(query);
    return sendResponse<SchoolPaginatedResponseDto>(
      res,
      200,
      'Deleted schools retrieved successfully',
      result,
    );
  }

  @Post(':uuid/restore')
  async restore(@Param('uuid') uuid: string, @Res() res: Response) {
    const restored = await this.schoolService.restore(uuid);
    return sendResponse<SchoolType>(
      res,
      200,
      'School restored successfully',
      mappingSchool(restored),
    );
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string, @Res() res: Response) {
    const school = await this.schoolService.findOneByUuid(uuid);
    return sendResponse<SchoolType>(
      res,
      200,
      'School retrieved successfully',
      mappingSchool(school),
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() dto: CreateSchoolDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const newSchool = await this.schoolService.create(dto, file);
    return sendResponse<SchoolType>(
      res,
      201,
      'School created successfully',
      mappingSchool(newSchool),
    );
  }

  @Put(':uuid')
  @UseInterceptors(FileInterceptor('logo'))
  async updatePut(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSchoolDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const updated = await this.schoolService.update(uuid, dto, file);
    return sendResponse<SchoolType>(
      res,
      200,
      'School updated successfully',
      mappingSchool(updated),
    );
  }

  @Patch(':uuid')
  @UseInterceptors(FileInterceptor('logo'))
  async updatePatch(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSchoolDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const updated = await this.schoolService.update(uuid, dto, file);
    return sendResponse<SchoolType>(
      res,
      200,
      'School updated successfully',
      mappingSchool(updated),
    );
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @Res() res: Response) {
    await this.schoolService.delete(uuid);
    return sendResponse(res, 200, 'School deleted successfully', null);
  }
}
