import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  In,
  Like,
  Repository,
  Equal,
  FindOptionsWhere,
  Between,
} from 'typeorm';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleTag } from '../article-tag/entities/article-tag.entity';
import { FindArticleDto } from './dto/find-article.dto';
import { User } from 'src/user/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { getRedisArticleViewedCacheKey } from './helper';
import { ArticleLike } from 'src/article-like/entities/article-like.entity';
import { ArticleCategory } from 'src/article-category/entities/article-category.entity';
import { ArticleComment } from 'src/article-comment/entities/article-comment.entity';
import { ArticleRecommend } from 'src/article-recommend/entities/article-recommend.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,

    @InjectRepository(ArticleTag)
    private readonly articleTagRepository: Repository<ArticleTag>,

    @InjectRepository(ArticleComment)
    private readonly ArticleCommentRepository: Repository<ArticleComment>,

    private readonly redisService: RedisService,
  ) {}

  async create(user: User, createArticleDto: CreateArticleDto) {
    // todo categoryId和tagIds怎么处理
    const { categoryId, tagIds, ...rest } = createArticleDto;
    const article = await this.articleRepository.create(rest);
    article.user = user;
    article.categoryId = categoryId;
    const tags = await this.articleTagRepository.find({
      where: { id: In(tagIds) },
    });
    article.tags = tags;
    return this.articleRepository.save(article);
  }

  async findAll(findArticleDto: FindArticleDto) {
    const take = +findArticleDto.pageSize || 10;
    const currentPage = +findArticleDto.currentPage || 1;
    const title = findArticleDto.title || undefined;
    const startTime = findArticleDto.startTime;
    const endTime = findArticleDto.endTime;

    const skip = (currentPage - 1) * take;
    const where: FindOptionsWhere<Article> = title
      ? { title: Like(`%${title}%`) }
      : {};
    if (startTime && endTime) {
      where.createTime = Between(new Date(startTime), new Date(endTime));
    }
    const { categoryId, tagId } = findArticleDto;
    if (categoryId) {
      where.categoryId = Equal(+categoryId);
    }
    if (tagId) {
      where.tags = { id: In([tagId]) };
    }

    const [articleList, count] = await this.articleRepository.findAndCount({
      where,
      relations: ['tags', 'user'],
      skip,
      take,
      select: [
        'categoryId',
        'id',
        'updateTime',
        'createTime',
        'cover',
        'title',
        'summary',
      ],
    });
    return {
      articleList,
      count,
    };
  }

  async getArticleDetail(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['tags', 'user'],
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    return article;
  }
  async getArticleStatus(articleId: number, userId: string) {
    const articleLike = await this.articleLikeRepository.findOne({
      where: {
        articleId: Equal(articleId),
        userId: Equal(userId),
      },
    });
    return {
      like: !!articleLike,
    };
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    let article = await this.articleRepository.findOne({
      where: { id },
    });
    article = this.articleRepository.merge(article, updateArticleDto);

    if (updateArticleDto.tagIds) {
      const tags = await this.articleTagRepository.find({
        where: {
          id: In(updateArticleDto.tagIds),
        },
      });
      article.tags = tags;
    }

    return this.articleRepository.save(article);
  }

  async remove(id: number) {
    const article = await this.articleRepository.findOne({ where: { id } });
    return this.articleRepository.remove(article);
  }

  async getArticleData(articleId: number, userId: string) {
    const articleLike = await this.articleLikeRepository.findOne({
      where: {
        articleId: Equal(articleId),
        userId: Equal(userId),
      },
    });
    const likeCount = await this.articleLikeRepository.count({
      where: { articleId: Equal(articleId) },
    });
    const commentCount = await this.ArticleCommentRepository.count({
      where: { articleId: Equal(articleId) },
    });
    const redisArticleViewedCacheKey = getRedisArticleViewedCacheKey(articleId);
    const viewCount = await this.redisService.get(redisArticleViewedCacheKey);

    return {
      isLike: !!articleLike,
      likeCount,
      commentCount,
      viewCount,
    };
  }
}
