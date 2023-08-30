import { IsNotEmpty, Length } from 'class-validator';

export class ArticleTagDto {
  @Length(2, 10, { message: '标签长度2-10个字符' })
  name: string;

  @IsNotEmpty({ message: '$property不能为空' })
  categoryId: number;
}
