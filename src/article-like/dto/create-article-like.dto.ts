import { IsNotEmpty } from 'class-validator';

export class CreateArticleLikeDto {
  @IsNotEmpty({
    message: '$property不能为空',
  })
  articleId: number;
}
