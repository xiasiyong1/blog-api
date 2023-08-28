import { IsNotEmpty, MaxLength } from 'class-validator';

export class ArticleCommentMessageDto {
  @MaxLength(200, { message: '$property不能超过200个字符' })
  @IsNotEmpty({ message: '$property不能为空' })
  content: string;

  @IsNotEmpty({ message: '$property不能为空' })
  to: string;
}
