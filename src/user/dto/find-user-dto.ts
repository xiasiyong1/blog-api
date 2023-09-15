import { IsOptional } from 'class-validator';
import { GenderEnum } from 'src/enum/gender.enum';

export class FindUserDto {
  @IsOptional()
  currentPage: number;
  @IsOptional()
  pageSize: number;
  @IsOptional()
  username: string;
  @IsOptional()
  gender: GenderEnum;
  @IsOptional()
  roleIds: number[];
  @IsOptional()
  email: string;
}
