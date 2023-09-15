import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInWithEmailDto } from './dto/sign-in-with-email.dto';
import { SignUpWithEmailDto } from './dto/sign-up-with-email.dto';
import { Roles } from '../decorators/role.decorators';
import { RoleEnum } from 'src/enum/role.enum';
import { AdminGuard } from './guards/admin.guard';

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
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  signInAdmin(@Body() signInWithEmailDto: SignInWithEmailDto) {
    return this.authService.signInWithEmail(signInWithEmailDto);
  }
}
