import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInWithEmailDto } from './dto/sign-in-with-email.dto';
import { SignUpWithEmailDto } from './dto/sign-up-with-email.dto';
import { InitUserDto } from './dto/init-user.dto';
import { Roles } from '../decorators/role.decorators';
import { RoleEnum } from 'src/enum/role.enum';
import { AdminGuard } from './guards/admin.guard';
import { RoleGuard } from './guards/role.guard';
import { JwtGuard } from './guards/jwt.guard';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { CreateUserByCodeDto } from './dto/create-user-by-code.dto';
import { GetInviteCodeDto } from './dto/get-invite-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/email/signup')
  signUpWithEmail(@Body() signUpWithEmailDto: SignUpWithEmailDto) {
    return this.authService.signUpWithEmail(signUpWithEmailDto);
  }
  @Post('/email/signin')
  signInWithEmail(@Body() signInWithEmailDto: SignInWithEmailDto) {
    return this.authService.signInWithEmail(signInWithEmailDto);
  }
  @UseGuards(AdminGuard)
  @Post('/admin/email/signin')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN, RoleEnum.VISITOR)
  signInAdmin(@Body() signInWithEmailDto: SignInWithEmailDto) {
    return this.authService.signInWithEmail(signInWithEmailDto);
  }
  @Post('/init')
  initUser(@Body() initUserDto: InitUserDto) {
    return this.authService.initUser(initUserDto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @Post('/add-visitor')
  addVisitor(@Body() initUserDto: InitUserDto) {
    return this.authService.addUser(initUserDto);
  }

  @Get('/invite')
  invite(@Query('code') code: string) {
    return this.authService.getInviteInfo(code);
  }

  @Post('/signup/code')
  createUserByCode(@Body() createUserByCodeDto: CreateUserByCodeDto) {
    return this.authService.createUserByCode(createUserByCodeDto);
  }
}
