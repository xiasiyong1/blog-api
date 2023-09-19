import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindUserDto } from './dto/find-user-dto';
import { SuperAdminUpdateUserDto } from './dto/super-admin-update-user.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorators';
import { RoleEnum } from 'src/enum/role.enum';

@Controller('user')
@UseGuards(JwtGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleEnum.SUPER_ADMIN)
  @Patch('/role/:id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.userService.updateRole(id, updateRoleDto);
  }

  @Roles(RoleEnum.SUPER_ADMIN)
  @Get('list')
  findAll(@Query() findUserDto: FindUserDto) {
    return this.userService.findAll(findUserDto);
  }

  @Get('')
  findOne(@Req() req: Request) {
    const user: User = req['user'];
    return user;
  }

  @Roles(RoleEnum.SUPER_ADMIN)
  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch('')
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user: User = req['user'];
    return this.userService.update(user.id, updateUserDto);
  }

  @Roles(RoleEnum.SUPER_ADMIN)
  @Patch(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() superAdminUpdateUserDto: SuperAdminUpdateUserDto,
  ) {
    const { roleIds, ...rest } = superAdminUpdateUserDto;
    return this.userService.update(id, rest, roleIds);
  }

  @Roles(RoleEnum.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
