import { IsOptional, Length } from 'class-validator';

export class UpdateArticleTagDto {
  @Length(2, 10, { message: '标签长度2-10个字符' })
  name: string;

  @IsOptional()
  categoryId: number;
}
