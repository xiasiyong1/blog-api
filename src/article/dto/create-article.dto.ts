import { IsNotEmpty, IsOptional, Length } from 'class-validator';

const artilce = {
  title: 'vue入门',
  cover: '1234',
  summary: '12434',
  content: '1231234',
  categoryId: '1',
  tagIds: [1, 4, 7],
};

export class CreateArticleDto {
  @Length(2, 100, { message: '标题长度在2-100个字符以内' })
  title: string;

  @IsOptional()
  cover: string;

  @Length(1, 120, { message: '描述长度在2-120个字符以内' })
  summary: string;

  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @IsNotEmpty({ message: '分类不能为空' })
  categoryId: number;

  @IsNotEmpty({ message: '标签不能为空' })
  tagIds: number[];
}
