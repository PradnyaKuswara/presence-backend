import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { sendError, sendResponse } from 'src/helpers/response';
import { Response } from 'express';
import { Role } from './entities/role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    try {
      const role = await this.roleService.create(createRoleDto);
      return sendResponse<Role>(res, 201, 'succesfully created data', role);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return sendError<Error>(res, 500, 'internal server error', error);
      }
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const roles = await this.roleService.findAll();
      return sendResponse<Role[]>(
        res,
        200,
        'succesfully retrieved data',
        roles,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return sendError<Error>(res, 500, 'internal server error', error);
      }
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }
}
