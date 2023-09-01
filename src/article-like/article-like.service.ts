import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleLike } from './entities/article-like.entity';
import { Equal, In, Repository } from 'typeorm';
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
  addArticleLike(articleId: number, userId: string) {
    const record = this.articleLikeRepository.create({
      articleId,
      userId,
    });
    return this.articleLikeRepository.save(record);
  }

  async findUserLikeArticles(userId: string) {
    const records = await this.articleLikeRepository.find({
      relations: ['articleId'],
      where: {
        userId: Equal(userId),
      },
      // select: ['articleId'],
    });
    return records.map((record) => {
      return {
        article: record.articleId,
        id: record.id,
        createdAt: record.createdAt,
      };
    });
  }

  async findArticleLikeUsers(articleId: number) {
    const userIds = await this.articleLikeRepository.find({
      where: {
        articleId,
      },
    });
    return this.userRepository.find({
      where: {
        id: In(userIds),
      },
    });
  }

  async removeArticleLike(articleId: number, userId: string) {
    const record = await this.articleLikeRepository.find({
      where: {
        articleId: Equal(articleId),
        userId: Equal(userId),
      },
    });
    if (record) {
      return this.articleLikeRepository.remove(record);
    } else {
      throw new NotFoundException('Record not found ');
    }
  }
}
