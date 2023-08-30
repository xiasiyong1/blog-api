import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleCategoryDto } from './dto/article-category.dto';
import { ArticleTagDto } from './dto/article-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { FindArticleDto } from './dto/find-article.dto';
import { ArticleCommentDto } from './dto/article-comment.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { ArticleCommentMessageDto } from './dto/article-comment-message.dto';

@Controller('article')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('/comment/:articleId')
  @UseGuards(JwtGuard)
  createComment(
    @Param('articleId') articleId: string,
    @Body() articleCommentDto: ArticleCommentDto,
    @Req() req: Request,
  ) {
    const user: User = req['user'];
    return this.articleService.createComment(
      +articleId,
      user,
      articleCommentDto,
    );
  }
  @Get('/comment/:articleId')
  getArticleComments(@Param('articleId') articleId: string) {
    return this.articleService.getComments(+articleId);
  }

  @Post('/recommend/:articleId')
  recommendArticle(@Param('articleId') articleId: string) {
    return this.articleService.recommendArticle(+articleId);
  }
  @Get('/recommend')
  getRecommendArticles(n) {
    return this.articleService.getRecommendArticles();
  }

  @Post('/comment/message/:commentId')
  @UseGuards(JwtGuard)
  createCommentMessage(
    @Param('commentId') commentId: string,
    @Req() req: Request,
    @Body() articleCommentMessageDto: ArticleCommentMessageDto,
  ) {
    const user: User = req['user'];
    const from = user.id;
    return this.articleService.createCommentMessage(
      +commentId,
      from,
      articleCommentMessageDto,
    );
  }

  @Post('/category')
  createCategory(@Body() articleCategoryDto: ArticleCategoryDto) {
    return this.articleService.createCategory(articleCategoryDto);
  }

  @Get('/category')
  findAllCategory(@Query() findCategoryDto: FindCategoryDto) {
    return this.articleService.findAllCategory(findCategoryDto);
  }

  @Get('/category/:categoryId/tags')
  findTagsByCategory(@Param('categoryId') categoryId: string) {
    return this.articleService.findTagsByCategory(+categoryId);
  }

  @Get('/category/:id')
  findCategory(@Param('id') id: string) {
    return this.articleService.findCategory(+id);
  }

  @Patch('/category/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() articleCategoryDto: ArticleCategoryDto,
  ) {
    return this.articleService.updateCategory(+id, articleCategoryDto);
  }

  @Delete('/category/:id')
  removeCategory(@Param('id') id: string) {
    return this.articleService.removeCategory(+id);
  }

  @Post('/tag')
  createTag(@Body() articleTagDto: ArticleTagDto) {
    return this.articleService.createTag(articleTagDto);
  }

  @Get('/tag')
  findAllTag(@Query() findAllTag: FindTagDto) {
    return this.articleService.findAllTag(findAllTag);
  }

  @Get('/tag/:id')
  findTag(@Param('id') id: string) {
    return this.articleService.findTag(+id);
  }

  @Patch('/tag/:id')
  updateTag(@Param('id') id: string, @Body() articleTagDto: ArticleTagDto) {
    return this.articleService.updateTag(+id, articleTagDto);
  }

  @Delete('/tag/:id')
  removeTag(@Param('id') id: string) {
    return this.articleService.removeTag(+id);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createArticleDto: CreateArticleDto, @Req() req: Request) {
    const user: User = req['user'];
    return this.articleService.create(user, createArticleDto);
  }

  @Get()
  findAll(@Query() findArticleDto: FindArticleDto) {
    return this.articleService.findAll(findArticleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
