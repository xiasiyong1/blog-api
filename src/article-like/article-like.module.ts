import { Module } from '@nestjs/common';
import { ArticleLikeService } from './article-like.service';
import { ArticleLikeController } from './article-like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleLike } from './entities/article-like.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleLike, User, Article]),
    AuthModule,
    UserModule,
  ],
  controllers: [ArticleLikeController],
  providers: [ArticleLikeService],
})
export class ArticleLikeModule {}
