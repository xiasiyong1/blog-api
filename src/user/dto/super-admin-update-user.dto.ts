import { GenderEnum } from 'src/enum/gender.enum';
import { IsOptional } from 'class-validator';

export class SuperAdminUpdateUserDto {
  @IsOptional()
  gender: GenderEnum;
  @IsOptional()
  username: string;
  @IsOptional()
  avatar: string;
  @IsOptional()
  roleIds: number[];
}
