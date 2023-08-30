import { IsNotEmpty } from 'class-validator';

export class ArticleRecommendDto {
  @IsNotEmpty({ message: '$property不能为空' })
  articleId: number;
}
