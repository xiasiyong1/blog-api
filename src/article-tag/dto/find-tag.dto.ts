import { IsOptional } from 'class-validator';

export class FindTagDto {
  @IsOptional()
  name: string;
  @IsOptional()
  currentPage: string;
  @IsOptional()
  pageSize: string;
}
