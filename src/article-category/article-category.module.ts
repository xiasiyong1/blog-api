import { Module } from '@nestjs/common';
import { ArticleCategoryService } from './article-category.service';
import { ArticleCategoryController } from './article-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCategory } from './entities/article-category.entity';
import { ArticleTag } from 'src/article-tag/entities/article-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleCategory, ArticleTag])],
  controllers: [ArticleCategoryController],
  providers: [ArticleCategoryService],
})
export class ArticleCategoryModule {}
