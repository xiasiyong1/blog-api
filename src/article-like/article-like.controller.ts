import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ArticleLikeService } from './article-like.service';
import { CreateArticleLikeDto } from './dto/create-article-like.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

@Controller('article-like')
export class ArticleLikeController {
  constructor(private readonly articleLikeService: ArticleLikeService) {}

  @Post('/:articleId')
  @UseGuards(JwtGuard)
  addArticleLike(@Req() req: Request, @Param('articleId') articleId: string) {
    const user: User = req['user'];
    return this.articleLikeService.addArticleLike(+articleId, user.id);
  }

  @Get('/articles')
  @UseGuards(JwtGuard)
  findUserLikeArticles(@Req() req: Request) {
    const user: User = req['user'];
    return this.articleLikeService.findUserLikeArticles(user.id);
  }

  @Get('/:articleId/users')
  findArticleLikeUsers(@Param('articleId') articleId: string) {
    return this.articleLikeService.findArticleLikeUsers(+articleId);
  }

  @Delete('/:articleId')
  @UseGuards(JwtGuard)
  removeArticleLike(
    @Req() req: Request,
    @Param('articleId') articleId: string,
  ) {
    const user: User = req['user'];
    return this.articleLikeService.removeArticleLike(+articleId, user.id);
  }
}
