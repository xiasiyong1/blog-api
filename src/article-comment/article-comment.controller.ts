import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ArticleCommentService } from './article-comment.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ArticleCommentDto } from './dto/article-comment.dto';
import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';

@Controller('article-comment')
export class ArticleCommentController {
  constructor(private readonly articleCommentService: ArticleCommentService) {}

  @Post('/:articleId')
  @UseGuards(JwtGuard)
  createComment(
    @Param('articleId') articleId: string,
    @Body() articleCommentDto: ArticleCommentDto,
    @Req() req: Request,
  ) {
    const user: User = req['user'];
    return this.articleCommentService.createComment(
      +articleId,
      user,
      articleCommentDto,
    );
  }
  @Get('/list/:articleId')
  getArticleComments(@Param('articleId') articleId: string) {
    return this.articleCommentService.getComments(+articleId);
  }
}
