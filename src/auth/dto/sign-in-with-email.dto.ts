import { IsEmail, Length } from 'class-validator';

export class SignInWithEmailDto {
  @IsEmail(
    {},
    {
      message: '邮箱格式不正确',
    },
  )
  email: string;
  @Length(6, 20, { message: '密码长度为6-20位' })
  password: string;
}
