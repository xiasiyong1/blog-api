import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleLike } from './entities/article-like.entity';
import { Equal, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class ArticleLikeService {
  constructor(
    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}
  async addArticleLike(articleId: number, userId: string) {
    const exist = await this.articleLikeRepository.exist({
      where: {
        articleId: Equal(articleId),
        userId: Equal(userId),
      },
    });
    if (exist) {
      throw new BadRequestException('Record already exist');
    }
    const record = this.articleLikeRepository.create({
      articleId,
      userId,
    });
    await this.articleLikeRepository.save(record);
  }

  async findUserLikeArticles(userId: string) {
    const [records, count] = await this.articleLikeRepository.findAndCount({
      relations: ['articleId'],
      where: {
        userId: Equal(userId),
      },
    });
    return {
      count,
      articles: records.map((record) => record.articleId),
    };
  }

  async findArticleLikeUsers(articleId: number) {
    const [records, count] = await this.articleLikeRepository.findAndCount({
      relations: ['userId'],
      where: {
        articleId,
      },
    });
    return { count, users: records.map((record) => record.userId) };
  }

  async removeArticleLike(articleId: number, userId: string) {
    const exist = await this.articleLikeRepository.exist({
      where: {
        articleId: Equal(articleId),
        userId: Equal(userId),
      },
    });
    if (!exist) {
      throw new BadRequestException('Record not exist');
    }
    const record = await this.articleLikeRepository.find({
      where: {
        articleId: Equal(articleId),
        userId: Equal(userId),
      },
    });
    if (record) {
      await this.articleLikeRepository.remove(record);
    } else {
      throw new BadRequestException('Record not found ');
    }
  }
}
