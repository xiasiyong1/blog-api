import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInWithEmailDto } from './dto/sign-in-with-email.dto';
import { RoleEnum } from '../enum/role.enum';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignUpWithEmailDto } from './dto/sign-up-with-email.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { SignUpWithEmailVo } from './vo/sign-up-with-email.vo';
import { SignInWithEmailVo } from './vo/sign-in-with-email.vo';
import { RedisService } from 'src/redis/redis.service';
import { Role } from 'src/role/entities/role.entity';
import { InitUserDto } from './dto/init-user.dto';
import { getRandomString } from 'src/utils/crypto';
import { CreateUserByCodeDto } from './dto/create-user-by-code.dto';
import { GetInviteCodeDto } from './dto/get-invite-code.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signUpWithEmail(signUpWithEmailDto: SignUpWithEmailDto) {
    const { email, password, code } = signUpWithEmailDto;
    const EMAIL_CODE_REDIS_KEY = `captcha_${email}`;
    const redisCode = await this.redisService.get(EMAIL_CODE_REDIS_KEY);
    if (redisCode !== code) {
      throw new NotFoundException('验证码错误');
    }
    const safePassword = await argon2.hash(password);
    const role = await this.roleRepository.findOne({
      where: { id: RoleEnum.USER },
    });
    let user = await this.userRepository.create({
      email,
      username: email,
      password: safePassword,
      roles: [role],
    });

    user = await this.userRepository.save(user);

    const signUpWithEmailVo = new SignUpWithEmailVo();
    signUpWithEmailVo.email = user.email;
    signUpWithEmailVo.userId = user.id;
    return signUpWithEmailVo;
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
    const signInWithEmailVo = new SignInWithEmailVo();
    signInWithEmailVo.access_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get(ConfigEnum.JWT_ACCESS_TOKEN_EXPIRE),
    });
    signInWithEmailVo.refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get(ConfigEnum.JWT_REFRESH_TOKEN_EXPIRE),
    });
    return signInWithEmailVo;
  }
  async initUser(initUserDto: InitUserDto) {
    const { email, password } = initUserDto;
    if (email === '514123901@qq.com') {
      const safePassword = await argon2.hash(password);
      const role = await this.roleRepository.findOne({
        where: { id: RoleEnum.SUPER_ADMIN },
      });
      const user = await this.userRepository.create({
        email,
        username: email,
        password: safePassword,
        roles: [role],
      });

      await this.userRepository.save(user);
    } else {
      throw new ForbiddenException('无权限');
    }
  }
  async addUser(initUserDto: InitUserDto) {
    const { email, password } = initUserDto;
    const exist = await this.userRepository.exist({
      where: { email },
    });
    if (exist) {
      throw new ForbiddenException('该用户已存在');
    }
    const safePassword = await argon2.hash(password);
    const role = await this.roleRepository.findOne({
      where: { id: RoleEnum.VISITOR },
    });
    const user = await this.userRepository.create({
      email,
      password: safePassword,
      roles: [role],
    });

    await this.userRepository.save(user);
  }

  getInviteInfo(code: string) {
    return this.redisService.hashGet(code);
  }
  async createUserByCode(createUserByCodeDto: CreateUserByCodeDto) {
    const { email, code, password } = createUserByCodeDto;
    const redisInfo = await this.redisService.hashGet(code);
    if (!redisInfo) {
      throw new NotFoundException('邀请码不存在');
    }
    if (redisInfo.email !== email) {
      throw new ForbiddenException('邀请码不匹配');
    }
    const exist = await this.userRepository.exist({
      where: { email },
    });
    if (exist) {
      throw new ForbiddenException('该用户已存在');
    }
    const roleId = +redisInfo.roleId;
    const role = await this.roleRepository.findOne({
      where: {
        id: roleId,
      },
    });
    if (!role) {
      throw new ForbiddenException('角色不存在');
    }
    const user = await this.userRepository.create({
      email,
      roles: [role],
      password: await argon2.hash(password),
    });
    await this.userRepository.save(user);
  }
}
