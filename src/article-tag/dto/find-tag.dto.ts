import { IsOptional } from 'class-validator';

export class FindTagDto {
  @IsOptional()
  name: string;
}
