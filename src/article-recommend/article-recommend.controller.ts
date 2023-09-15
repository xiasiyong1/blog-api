import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ArticleRecommendService } from './article-recommend.service';
import { CreateArticleRecommendDto } from './dto/create-article-recommend.dto';
import { UpdateArticleRecommendDto } from './dto/update-article-recommend.dto';

@Controller('article-recommend')
export class ArticleRecommendController {
  constructor(
    private readonly articleRecommendService: ArticleRecommendService,
  ) {}

  @Post('/recommend/:articleId')
  recommendArticle(@Param('articleId') articleId: string) {
    return this.articleRecommendService.recommendArticle(+articleId);
  }
  @Get('/recommend')
  getRecommendArticles(n) {
    return this.articleRecommendService.getRecommendArticles();
  }
}
