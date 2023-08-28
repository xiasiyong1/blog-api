import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleTag } from './entities/article-tag.entity';
import { ArticleCategory } from './entities/article-category.entity';
import { ArticleComment } from './entities/article-comment.entity';
import { ArticleCommentMessage } from './entities/article-comment-message.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      ArticleTag,
      ArticleCategory,
      ArticleComment,
      ArticleCommentMessage,
    ]),
    UserModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
