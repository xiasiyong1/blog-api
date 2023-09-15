import { Injectable } from '@nestjs/common';
import { ArticleCategoryDto } from './dto/article-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleCategory } from './entities/article-category.entity';
import { Like, Repository } from 'typeorm';
import { ArticleTag } from 'src/article-tag/entities/article-tag.entity';
@Injectable()
export class ArticleCategoryService {
  constructor(
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
    @InjectRepository(ArticleTag)
    private readonly articleTagRepository: Repository<ArticleTag>,
  ) {}
  createCategory(articleCategoryDto: ArticleCategoryDto) {
    const category = this.articleCategoryRepository.create(articleCategoryDto);
    return this.articleCategoryRepository.save(category);
  }

  async findAllCategory(findCategoryDto: FindCategoryDto) {
    const name = findCategoryDto.name || undefined;
    const where = name ? { name: Like(`%${name}%`) } : {};
    return await this.articleCategoryRepository.find({
      where,
    });
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
  async findTagsByCategory(categoryId: number) {
    return this.articleTagRepository.find({
      where: {
        categoryId,
      },
    });
  }
}
