import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class ArticleCommentDto {
  @MaxLength(200, { message: '$property不能超过200个字符' })
  @IsNotEmpty({ message: '$property不能为空' })
  content: string;

  @IsOptional({ message: '$property不能为空' })
  images: string;
}
