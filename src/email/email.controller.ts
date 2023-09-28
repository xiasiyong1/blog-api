import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailCodeDto } from './dto/send-email-code.dto';
import { SendInviteEmailDto } from './dto/send-invite-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { RedisService } from 'src/redis/redis.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorators';
import { RoleEnum } from 'src/enum/role.enum';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { getRandomString } from 'src/utils/crypto';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  @Post('code')
  async sendEmailCode(@Body() sendEmailCodeDto: SendEmailCodeDto) {
    const { email } = sendEmailCodeDto;
    const code = Math.random().toString().slice(2, 8);
    const EMAIL_CODE_REDIS_KEY = `captcha_${email}`;
    if (await this.redisService.get(EMAIL_CODE_REDIS_KEY)) {
      throw new ForbiddenException(`请登录邮箱${email}查看验证码`);
    }
    // 过期时间5分钟
    await this.redisService.set(`captcha_${email}`, code, 5 * 60);
    try {
      await this.emailService.sendMail({
        to: email,
        subject: '注册验证码',
        html: `<p>你的注册验证码是: ${code}</p>`,
      });
      return '发送成功';
    } catch (err) {
      console.log(err);
    }
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @Post('/invite')
  async invite(
    @Req() req: Request,
    @Body() sendInviteEmailDto: SendInviteEmailDto,
  ) {
    const inviteUser: User = req['user'];
    const { email, roleId } = sendInviteEmailDto;
    const code = getRandomString(32);
    await this.redisService.hashSet(
      code,
      { inviteUserEmail: inviteUser.email, email, roleId },
      60 * 60 * 24 * 7,
    );
    try {
      const adminDomain = this.configService.get(ConfigEnum.ADMIN_DOMAIN);
      const url = `${adminDomain}/#/invite?code=${code}`;
      console.log(1, url);
      await this.emailService.sendMail({
        to: email,
        subject: '邮箱邀请注册',
        html: `<p>${inviteUser.email}邀请你加入，点击下方链接注册</p>
          <a href="${url}">注册</a>
          `,
      });
      console.log(2, url);
      return '发送成功';
    } catch (err) {
      console.log(err);
      return '发送失败';
    }
  }
}
