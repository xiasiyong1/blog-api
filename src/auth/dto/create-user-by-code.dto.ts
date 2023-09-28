import { IsNotEmpty } from 'class-validator';
import { InitUserDto } from './init-user.dto';

export class CreateUserByCodeDto extends InitUserDto {
  @IsNotEmpty({ message: '邀请码不能为空' })
  code: string;
}
