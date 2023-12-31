import { GenderEnum } from 'src/enum/gender.enum';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  gender: GenderEnum;
  @IsOptional()
  username: string;
  @IsOptional()
  avatar: string;
}
