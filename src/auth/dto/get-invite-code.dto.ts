import { IsNotEmpty } from 'class-validator';

export class GetInviteCodeDto {
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;
  @IsNotEmpty({ message: '角色不能为空' })
  roleId: string;
}
