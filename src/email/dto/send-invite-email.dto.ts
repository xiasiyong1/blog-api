import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendInviteEmailDto {
  @IsEmail({}, { message: '$property格式不正确' })
  email: string;

  @IsNotEmpty({ message: '角色不能为空' })
  roleId: string;
}
