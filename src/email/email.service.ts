import { Injectable } from '@nestjs/common';
import { SendEmailCodeDto } from './dto/send-email-code.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get(ConfigEnum.EMAIL_HOST),
      port: configService.get(ConfigEnum.EMAIL_PORT),
      secure: false,
      auth: {
        user: configService.get(ConfigEnum.EMAIL_USER),
        pass: configService.get(ConfigEnum.EMAIL_PASS),
      },
    });
  }

  async sendMail({ to, subject, html }) {
    try {
      await this.transporter.sendMail({
        from: {
          name: '系统邮件',
          address: this.configService.get(ConfigEnum.EMAIL_USER),
        },
        to,
        subject,
        html,
      });
    } catch (e) {
      console.log(e);
    }
  }

  create(createEmailDto: SendEmailCodeDto) {
    return 'This action adds a new email';
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
