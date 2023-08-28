import { Length } from 'class-validator';

export class ArticleCategoryDto {
  @Length(2, 10, { message: '分类长度2-10个字符' })
  name: string;
}
