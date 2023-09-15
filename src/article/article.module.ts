import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleTag } from '../article-tag/entities/article-tag.entity';
import { UserModule } from 'src/user/user.module';
import { ArticleLike } from 'src/article-like/entities/article-like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticleTag, ArticleLike]),
    UserModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
