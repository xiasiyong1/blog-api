import {
  Controller,
  Get,
  Post,
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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtToken } from 'src/types/jwt';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindUserDto } from './dto/find-user-dto';

@Controller('user')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create();
  }
  @Patch('/profile')
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
  ) {
    const user: User = req['user'];
    return this.userService.updateProfile(user.id, updateProfileDto);
  }
  @Patch('/role/:id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.userService.updateRole(id, updateRoleDto);
  }

  @Get()
  findAll(@Query() findUserDto: FindUserDto) {
    return this.userService.findAll(findUserDto);
  }
  @Get('info')
  getUserInfo(@Req() req: Request) {
    const user: User = req['user'];
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
