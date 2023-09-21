import { Module } from '@nestjs/common';
import { ArticleRecommendService } from './article-recommend.service';
import { ArticleRecommendController } from './article-recommend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleRecommend } from './entities/article-recommend.entity';
import { Article } from 'src/article/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleRecommend, Article])],
  controllers: [ArticleRecommendController],
  providers: [ArticleRecommendService],
})
export class ArticleRecommendModule {}
