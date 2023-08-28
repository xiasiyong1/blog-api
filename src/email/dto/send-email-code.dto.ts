import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailCodeDto {
  @IsEmail({}, { message: '$property格式不正确' })
  @IsNotEmpty({
    message: '$property参数为空',
  })
  email: string;
}
