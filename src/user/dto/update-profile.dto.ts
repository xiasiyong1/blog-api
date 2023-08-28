import { IsOptional } from 'class-validator';
import { GenderEnum } from 'src/enum/gender.enum';

export class UpdateProfileDto {
  @IsOptional()
  username: string;
  @IsOptional()
  avatar: string;
  @IsOptional()
  gender: GenderEnum;
}
