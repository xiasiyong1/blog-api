import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorators';
import { RoleEnum } from 'src/enum/role.enum';

@UseGuards(JwtGuard, RoleGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles(RoleEnum.SUPER_ADMIN)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Roles(RoleEnum.SUPER_ADMIN)
  @Get('/list')
  findRoles(@Query('name') name: string) {
    return this.roleService.findRoles(name);
  }

  @Roles(RoleEnum.SUPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Roles(RoleEnum.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Roles(RoleEnum.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
