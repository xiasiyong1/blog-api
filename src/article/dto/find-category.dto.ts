import { IsOptional } from 'class-validator';

export class FindCategoryDto {
  @IsOptional()
  name: string;
  @IsOptional()
  currentPage: string;
  @IsOptional()
  pageSize: string;
}
