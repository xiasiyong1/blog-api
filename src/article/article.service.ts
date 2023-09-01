import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { ArticleTag } from './entities/article-tag.entity';
import { ArticleCategory } from './entities/article-category.entity';
import { ArticleCategoryDto } from './dto/article-category.dto';
import { ArticleTagDto } from './dto/article-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { FindArticleDto } from './dto/find-article.dto';
import { ArticleCommentDto } from './dto/article-comment.dto';
import { ArticleComment } from './entities/article-comment.entity';
import { User } from 'src/user/entities/user.entity';
import { ArticleCommentMessageDto } from './dto/article-comment-message.dto';
import { ArticleCommentMessage } from './entities/article-comment-message.entity';
import { ArticleRecommend } from './entities/article-recommend.entity';
import { RedisService } from 'src/redis/redis.service';
import { getRedisArticleViewedCacheKey } from './helper';
import { ArticleLike } from 'src/article-like/entities/article-like.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(ArticleTag)
    private readonly articleTagRepository: Repository<ArticleTag>,
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
    @InjectRepository(ArticleComment)
    private readonly articleCommentRepository: Repository<ArticleComment>,
    @InjectRepository(ArticleCommentMessage)
    private readonly articleCommentMessageRepository: Repository<ArticleCommentMessage>,
    @InjectRepository(ArticleRecommend)
    private readonly articleRecommendRepository: Repository<ArticleRecommend>,

    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,

    private readonly redisService: RedisService,
  ) {}

  createCategory(articleCategoryDto: ArticleCategoryDto) {
    const category = this.articleCategoryRepository.create(articleCategoryDto);
    return this.articleCategoryRepository.save(category);
  }

  async findAllCategory(findCategoryDto: FindCategoryDto) {
    const name = findCategoryDto.name || undefined;
    const where = name ? { name: Like(`%${name}%`) } : {};
    return await this.articleCategoryRepository.find({
      where,
    });
  }

  findCategory(id: number) {
    return this.articleCategoryRepository.findOne({ where: { id } });
  }
  async updateCategory(id: number, articleCategoryDto: ArticleCategoryDto) {
    let category = await this.articleCategoryRepository.findOne({
      where: { id },
    });
    category = await this.articleCategoryRepository.merge(
      category,
      articleCategoryDto,
    );
    return this.articleCategoryRepository.save(category);
  }

  async removeCategory(id: number) {
    const category = await this.articleCategoryRepository.findOne({
      where: { id },
    });
    return this.articleCategoryRepository.remove(category);
  }

  async createTag(articleTagDto: ArticleTagDto) {
    const { name, categoryId } = articleTagDto;
    const articleCategory = await this.articleCategoryRepository.findOne({
      where: { id: categoryId },
    });
    const tag = this.articleTagRepository.create({ name });
    tag.category = articleCategory;
    return this.articleTagRepository.save(tag);
  }

  async findAllTag(findTagDto: FindTagDto) {
    const take = +findTagDto.pageSize || 10;
    const currentPage = +findTagDto.currentPage || 1;
    const name = findTagDto.name || undefined;
    const skip = (currentPage - 1) * take;
    const where = name ? { name: Like(`%${name}%`) } : {};
    const [tags, count] = await this.articleTagRepository.findAndCount({
      where,
      relations: { category: true },
      take,
      skip,
    });
    return {
      tags,
      count,
    };
  }

  async findTagsByCategory(categoryId: number) {
    const where: FindOptionsWhere<ArticleTag> = {
      category: { id: categoryId },
    };

    return this.articleTagRepository.find({
      where,
    });
  }

  findTag(id: number) {
    return this.articleTagRepository.findOne({ where: { id } });
  }

  async updateTag(id: number, articleTagDto: ArticleTagDto) {
    const tag = await this.articleTagRepository.findOne({ where: { id } });
    const { categoryId, name } = articleTagDto;
    const category = await this.articleCategoryRepository.findOne({
      where: { id: categoryId },
    });
    tag.category = category;
    tag.name = name;
    return this.articleTagRepository.save(tag);
  }

  async removeTag(id: number) {
    const tag = await this.articleTagRepository.findOne({ where: { id } });
    return this.articleTagRepository.remove(tag);
  }

  async addCategoryToArticle(article: Article, categoryId: number) {
    if (categoryId) {
      const category = await this.articleCategoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        // 传了categoryId但是category不存在
        throw new ForbiddenException('分类不存在');
      }
      article.category = category;
    }
  }
  async addTagsToArticle(article: Article, tagIds: number[]) {
    if (tagIds && tagIds.length > 0) {
      const tags = await this.articleTagRepository.find({
        where: { id: In(tagIds) },
      });
      if (tagIds.length !== tags.length) {
        throw new ForbiddenException('标签类型错误');
      }
      article.tags = tags;
    }
  }

  async create(user: User, createArticleDto: CreateArticleDto) {
    // todo categoryId和tagIds怎么处理
    const { categoryId, tagIds, ...rest } = createArticleDto;
    const article = await this.articleRepository.create(rest);
    article.author = user;
    await this.addCategoryToArticle(article, categoryId);
    await this.addTagsToArticle(article, tagIds);
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
      where.category = {
        id: Equal(+categoryId),
      };
    }
    if (tagId) {
      where.tags = {
        id: In([tagId]),
      };
    }

    const [articleList, count] = await this.articleRepository.findAndCount({
      where,
      relations: { category: true, tags: true },
      skip,
      take,
      select: [
        'category',
        'id',
        'updateTime',
        'createTime',
        'cover',
        'title',
        'tags',
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
      relations: { tags: true, category: true, author: true },
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    const redisArticleViewedCacheKey = getRedisArticleViewedCacheKey(id);
    const viewed = await this.redisService.get(redisArticleViewedCacheKey);
    return {
      ...article,
      viewed: +viewed,
    };
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
    const { categoryId, tagIds, ...rest } = updateArticleDto;
    let article = await this.articleRepository.findOne({
      where: { id },
      relations: {
        category: true,
        tags: true,
      },
    });

    await this.addCategoryToArticle(article, categoryId);
    await this.addTagsToArticle(article, tagIds);

    article = this.articleRepository.merge(article, rest);
    return this.articleRepository.save(article);
  }

  async remove(id: number) {
    const article = await this.articleRepository.findOne({ where: { id } });
    return this.articleRepository.remove(article);
  }

  async createComment(
    articleId: number,
    user: User,
    articleCommentDto: ArticleCommentDto,
  ) {
    const articleComment = await this.articleCommentRepository.create(
      articleCommentDto,
    );
    articleComment.article = await this.getArticleDetail(articleId);
    articleComment.user = user;
    return this.articleCommentRepository.save(articleComment);
  }
  async getComments(articleId: number) {
    const comments = await this.articleCommentRepository.find({
      relations: {
        user: true,
      },
      where: {
        article: {
          id: articleId,
        },
      },
    });
    const messages = await Promise.all(
      comments.map(({ id }) =>
        this.articleCommentMessageRepository.find({
          where: {
            id,
          },
        }),
      ),
    );

    return comments.map((comment, index) => {
      return {
        ...comment,
        messages: messages[index],
      };
    });
  }
  async createCommentMessage(
    commentId: number,
    from: string,
    articleCommentMessageDto: ArticleCommentMessageDto,
  ) {
    const message = {
      ...articleCommentMessageDto,
      from,
      commentId,
    };
    const commentMessage = await this.articleCommentMessageRepository.create(
      message,
    );
    return this.articleCommentMessageRepository.save(commentMessage);
  }
  async recommendArticle(articleId: number) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    const record = this.articleRecommendRepository.create({
      article,
    });
    return this.articleRecommendRepository.save(record);
  }
  async getRecommendArticles() {
    const recommends = await this.articleRecommendRepository.find({
      relations: { article: true },
    });
    return recommends.map((recommends) => recommends.article);
  }
}
