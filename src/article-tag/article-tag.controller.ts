import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticleTagService } from './article-tag.service';
import { ArticleTagDto } from './dto/article-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';

@Controller('article-tag')
export class ArticleTagController {
  constructor(private readonly articleTagService: ArticleTagService) {}

  @Post('')
  createTag(@Body() articleTagDto: ArticleTagDto) {
    return this.articleTagService.createTag(articleTagDto);
  }

  @Get('/list')
  findAllTag(@Query() findAllTag: FindTagDto) {
    return this.articleTagService.findAllTag(findAllTag);
  }

  @Get('/:id')
  findTag(@Param('id') id: string) {
    return this.articleTagService.findTag(+id);
  }

  @Patch('/:id')
  updateTag(@Param('id') id: string, @Body() articleTagDto: ArticleTagDto) {
    return this.articleTagService.updateTag(+id, articleTagDto);
  }

  @Delete('/:id')
  removeTag(@Param('id') id: string) {
    return this.articleTagService.removeTag(+id);
  }
}
