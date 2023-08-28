import { IsOptional } from 'class-validator';

export class FindArticleDto {
  @IsOptional()
  title: string;
  @IsOptional()
  categoryId: string;
  @IsOptional()
  tagIds: string;
  @IsOptional()
  startTime: string;
  @IsOptional()
  endTime: string;
  @IsOptional()
  currentPage: string;
  @IsOptional()
  pageSize: string;
}
