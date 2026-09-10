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
import { ClassService } from './class.service';
import {
  ClassType,
  CreateClassDto,
  DeleteClassDto,
  mappingClass,
  UpdateClassDto,
} from './dto/class.dto';
import { sendResponse } from 'src/helpers/response';
import { Response } from 'express';
import { AuthUser } from 'src/decorators/auth.decorator';
import { AuthUserPayload } from 'src/auth/dto/auth.dto';
import { PolicyGuard } from 'src/guards/policy.guard';
import { Policy } from 'src/decorators/policy.decorator';
import { ClassPolicy } from 'src/policies/class.policy';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  async findAllBySchoolId(
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const classes = await this.classService.getAllBySchoolId(user.school?.id ?? 0);
    return sendResponse<ClassType[]>(
      res,
      200,
      'Classes retrieved successfully',
      classes.map(mappingClass),
    );
  }

  @Post()
  async create(
    @Body() createClassDto: CreateClassDto,
    @Res() res: Response,
    @AuthUser() user: AuthUserPayload,
  ) {
    const newClass = await this.classService.create({
      ...createClassDto,
      school_id: user.school?.id ?? 0,
    });
    return sendResponse<ClassType>(
      res,
      201,
      'Class created successfully',
      mappingClass(newClass),
    );
  }

  @Patch()
  @UseGuards(PolicyGuard)
  @Policy(ClassPolicy, 'update', 'uuid', ClassService)
  async update(@Body() updateClassDto: UpdateClassDto, @Res() res: Response) {
    await this.classService.update({
      uuid: updateClassDto.uuid,
      name: updateClassDto.name,
    });
    return sendResponse(res, 200, 'Class updated successfully', null);
  }

  @Delete()
  @UseGuards(PolicyGuard)
  @Policy(ClassPolicy, 'delete', 'uuid', ClassService)
  async delete(@Body() deleteClassDto: DeleteClassDto, @Res() res: Response) {
    await this.classService.delete(deleteClassDto.uuid);
    return sendResponse(res, 200, 'Class deleted successfully', null);
  }
}
