import { Module } from '@nestjs/common';
import { ArticleTagService } from './article-tag.service';
import { ArticleTagController } from './article-tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleTag } from './entities/article-tag.entity';
import { ArticleCategory } from 'src/article-category/entities/article-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleTag, ArticleCategory])],
  controllers: [ArticleTagController],
  providers: [ArticleTagService],
})
export class ArticleTagModule {}
