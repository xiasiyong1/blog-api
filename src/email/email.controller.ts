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
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailCodeDto } from './dto/send-email-code.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { RedisService } from 'src/redis/redis.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
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

    await this.emailService.sendMail({
      to: email,
      subject: '注册验证码',
      html: `<p>你的注册验证码是: ${code}</p>`,
    });
    return '发送成功';
  }

  @Post()
  create(@Body() createEmailDto: SendEmailCodeDto) {
    return this.emailService.create(createEmailDto);
  }

  @Get()
  findAll() {
    return this.emailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {
    return this.emailService.update(+id, updateEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailService.remove(+id);
  }
}
