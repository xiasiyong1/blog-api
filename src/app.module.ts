import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from 'src/enum/config.enum';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { NoticeModule } from './notice/notice.module';
import { ArticleModule } from './article/article.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { UploadModule } from './upload/upload.module';
import { ArticleLikeModule } from './article-like/article-like.module';
import { ArticleCategoryModule } from './article-category/article-category.module';
import { ArticleTagModule } from './article-tag/article-tag.module';
import { ArticleCommentModule } from './article-comment/article-comment.module';
import { ArticleRecommendModule } from './article-recommend/article-recommend.module';

const envFilePath = [`.env.${process.env.NODE_ENV}`, '.env'];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true,
          // logging: true,
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    NoticeModule,
    ArticleModule,
    RedisModule,
    EmailModule,
    UploadModule,
    ArticleLikeModule,
    ArticleCategoryModule,
    ArticleTagModule,
    ArticleCommentModule,
    ArticleRecommendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
