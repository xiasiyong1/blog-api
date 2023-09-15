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
import { ArticleCategoryService } from './article-category.service';
import { ArticleCategoryDto } from './dto/article-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';

@Controller('article-category')
export class ArticleCategoryController {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @Post('')
  createCategory(@Body() articleCategoryDto: ArticleCategoryDto) {
    return this.articleCategoryService.createCategory(articleCategoryDto);
  }

  @Get('/list')
  findAllCategory(@Query() findCategoryDto: FindCategoryDto) {
    return this.articleCategoryService.findAllCategory(findCategoryDto);
  }

  @Get('/:categoryId/tags')
  findTagsByCategory(@Param('categoryId') categoryId: string) {
    return this.articleCategoryService.findTagsByCategory(+categoryId);
  }

  @Get('/:id')
  findCategory(@Param('id') id: string) {
    return this.articleCategoryService.findCategory(+id);
  }

  @Patch('/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() articleCategoryDto: ArticleCategoryDto,
  ) {
    return this.articleCategoryService.updateCategory(+id, articleCategoryDto);
  }

  @Delete('/:id')
  removeCategory(@Param('id') id: string) {
    return this.articleCategoryService.removeCategory(+id);
  }
}
