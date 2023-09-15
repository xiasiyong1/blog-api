import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleRecommendDto } from './create-article-recommend.dto';

export class UpdateArticleRecommendDto extends PartialType(CreateArticleRecommendDto) {}
