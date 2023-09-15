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
import { FindArticleDto } from './dto/find-article.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { getRedisArticleViewedCacheKey } from './helper';

@Controller('article')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly redisService: RedisService,
  ) {}

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
  @Get('/status/:articleId')
  @UseGuards(JwtGuard)
  getArticleStatus(@Param('articleId') articleId: string, @Req() req: Request) {
    const user: User = req['user'];
    return this.articleService.getArticleStatus(+articleId, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const redisArticleViewedCacheKey = getRedisArticleViewedCacheKey(+id);
    this.redisService.incr(redisArticleViewedCacheKey);
    return this.articleService.getArticleDetail(+id);
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
