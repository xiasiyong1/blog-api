import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignInWithEmailDto } from './dto/sign-in-with-email.dto';
import { SignUpWithEmailDto } from './dto/sign-up-with-email.dto';
import { Roles } from '../decorators/role.decorators';
import { RoleEnum } from 'src/enum/role.enum';
import { RoleGuard } from './guards/role.guard';
import { JwtGuard } from './guards/jwt.guard';
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
  @Post('/signin/admin')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  signInAdmin(@Body() signInWithEmailDto: SignInWithEmailDto) {
    return this.authService.signInWithEmail(signInWithEmailDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
