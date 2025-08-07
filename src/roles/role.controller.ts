import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { sendResponse } from 'src/helpers/response';
import { Response } from 'express';
import { Role } from './entities/role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    const role = await this.roleService.create(createRoleDto);
    return sendResponse<Role>(res, 201, 'succesfully created data', role);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const roles = await this.roleService.findAll();
    return sendResponse<Role[]>(res, 200, 'succesfully retrieved data', roles);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }
}
