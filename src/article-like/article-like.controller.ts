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

  @Post()
  @UseGuards(JwtGuard)
  addArticleLike(
    @Req() req: Request,
    @Body() createArticleLikeDto: CreateArticleLikeDto,
  ) {
    const user: User = req['user'];
    const { articleId } = createArticleLikeDto;
    return this.articleLikeService.addArticleLike(articleId, user.id);
  }

  @Get('/users')
  @UseGuards(JwtGuard)
  findUserLikeArticles(@Req() req: Request) {
    const user: User = req['user'];
    return this.articleLikeService.findUserLikeArticles(user.id);
  }

  @Get('/:articleId')
  findArticleLikeUsers(@Param('articleId') articleId: string) {
    return this.articleLikeService.findArticleLikeUsers(+articleId);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  removeArticleLike(@Req() req: Request, @Param('id') id: string) {
    const user: User = req['user'];
    return this.articleLikeService.removeArticleLike(+id, user.id);
  }
}
