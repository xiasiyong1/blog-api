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
  ) {}

  createCategory(articleCategoryDto: ArticleCategoryDto) {
    const category = this.articleCategoryRepository.create(articleCategoryDto);
    return this.articleCategoryRepository.save(category);
  }

  async findAllCategory(findCategoryDto: FindCategoryDto) {
    const take = +findCategoryDto.pageSize || 10;
    const currentPage = +findCategoryDto.currentPage || 1;
    const name = findCategoryDto.name || undefined;
    const skip = (currentPage - 1) * take;
    const where = name ? { name: Like(`%${name}%`) } : {};
    const [categoryList, count] =
      await this.articleCategoryRepository.findAndCount({
        where,
        skip,
        take,
      });
    return {
      categoryList,
      count,
    };
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

  createTag(articleTagDto: ArticleTagDto) {
    const tag = this.articleTagRepository.create(articleTagDto);
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
      take,
      skip,
    });
    return {
      tags,
      count,
    };
  }

  findTag(id: number) {
    return this.articleTagRepository.findOne({ where: { id } });
  }

  async updateTag(id: number, articleTagDto: ArticleTagDto) {
    let tag = await this.articleTagRepository.findOne({ where: { id } });
    tag = this.articleTagRepository.merge(tag, articleTagDto);
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

  async create(createArticleDto: CreateArticleDto) {
    // todo categoryId和tagIds怎么处理
    const { categoryId, tagIds, ...rest } = createArticleDto;
    const article = await this.articleRepository.create(rest);
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
    const { categoryId, tagIds } = findArticleDto;
    if (categoryId) {
      where.category = {
        id: Equal(+categoryId),
      };
    }
    if (tagIds) {
      where.tags = {
        id: In(tagIds.split(',')),
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

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: { tags: true, category: true },
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return article;
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
    articleComment.article = await this.findOne(articleId);
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
}
