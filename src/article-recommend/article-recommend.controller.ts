import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ArticleRecommendService } from './article-recommend.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorators';
import { RoleEnum } from 'src/enum/role.enum';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

@Controller('article-recommend')
export class ArticleRecommendController {
  constructor(
    private readonly articleRecommendService: ArticleRecommendService,
  ) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN_ARTICLE)
  @Post('/:articleId')
  recommendArticle(@Req() reg: Request, @Param('articleId') articleId: string) {
    const user: User = reg['user'];
    return this.articleRecommendService.recommendArticle(+articleId, user.id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN_ARTICLE)
  @Delete('/:articleId')
  removeRecommend(@Param('articleId') articleId: string) {
    return this.articleRecommendService.removeRecommend(+articleId);
  }
  @Get('/list')
  getRecommendArticles() {
    return this.articleRecommendService.getRecommendArticles();
  }
}
