import { IsNotEmpty, Length } from 'class-validator';

export class InitUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  email: string;
  @Length(6, 20, { message: '密码长度为6-20位' })
  password: string;
}
