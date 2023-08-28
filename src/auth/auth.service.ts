import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/user/entities/profile.entity';
import { SignInWithEmailDto } from './dto/sign-in-with-email.dto';
import { Role } from 'src/role/entities/role.entity';
import { RoleEnum } from '../enum/role.enum';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';
import { SignUpWithEmailDto } from './dto/sign-up-with-email.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }
  async signUpWithEmail(signUpWithEmailDto: SignUpWithEmailDto) {
    const { email, password } = signUpWithEmailDto;
    const profile = await this.profileRepository.create({});
    const defaultRole = await this.roleService.findOne(RoleEnum.USER);
    const safePassword = await argon2.hash(password);
    const user = await this.userRepository.create({
      email,
      password: safePassword,
      roles: [defaultRole],
    });

    profile.user = user;
    return this.profileRepository.save(profile);
  }
  async signInWithEmail(signInWithEmailDto: SignInWithEmailDto) {
    const { email, password } = signInWithEmailDto;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('用户名或密码错误');
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new NotFoundException('用户名或密码错误');
    }
    const payload = { sub: user.id, email: user.email, phone: user.phone };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get(ConfigEnum.JWT_ACCESS_TOKEN_EXPIRE),
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get(ConfigEnum.JWT_REFRESH_TOKEN_EXPIRE),
      }),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
