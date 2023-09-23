import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleTagService } from './article-tag.service';
import { ArticleTagDto } from './dto/article-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorators';
import { RoleEnum } from 'src/enum/role.enum';
import { UpdateArticleTagDto } from './dto/update-article-tag.dto';

@Controller('article-tag')
export class ArticleTagController {
  constructor(private readonly articleTagService: ArticleTagService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @Post('')
  createTag(@Body() articleTagDto: ArticleTagDto) {
    return this.articleTagService.createTag(articleTagDto);
  }

  @Get('/list')
  getArticleTagList(@Query() findAllTag: FindTagDto) {
    return this.articleTagService.getArticleTagList(findAllTag);
  }

  @Get('/:id')
  findTag(@Param('id') id: string) {
    return this.articleTagService.findTag(+id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @Patch('/:id')
  updateTag(
    @Param('id') id: string,
    @Body() updateArticleTagDto: UpdateArticleTagDto,
  ) {
    return this.articleTagService.updateTag(+id, updateArticleTagDto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @Delete('/:id')
  removeTag(@Param('id') id: string) {
    return this.articleTagService.removeTag(+id);
  }
}
