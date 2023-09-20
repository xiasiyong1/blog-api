import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleTag } from './entities/article-tag.entity';
import { Like, Repository } from 'typeorm';
import { ArticleTagDto } from './dto/article-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';
import { ArticleCategory } from 'src/article-category/entities/article-category.entity';
import { UpdateArticleTagDto } from './dto/update-article-tag.dto';

@Injectable()
export class ArticleTagService {
  constructor(
    @InjectRepository(ArticleTag)
    private readonly articleTagRepository: Repository<ArticleTag>,
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
  ) {}

  async createTag(articleTagDto: ArticleTagDto) {
    const { name, categoryId } = articleTagDto;
    const articleCategory = await this.articleCategoryRepository.findOne({
      where: { id: categoryId },
    });
    const tag = this.articleTagRepository.create({ name });
    tag.categoryId = articleCategory.id;
    return this.articleTagRepository.save(tag);
  }

  async findAllTag(findTagDto: FindTagDto) {
    const take = +findTagDto.pageSize || 10;
    const currentPage = +findTagDto.currentPage || 1;
    const name = findTagDto.name || undefined;
    const skip = (currentPage - 1) * take;
    const where = name ? { name: Like(`%${name}%`) } : {};
    const [tags, count] = await this.articleTagRepository.findAndCount({
      where,
      relations: ['categoryId'],
      take,
      skip,
    });
    return {
      tags,
      count,
    };
  }

  findTag(id: number) {
    return this.articleTagRepository.findOne({
      where: { id },
      relations: ['categoryId'],
    });
  }

  async updateTag(id: number, updateArticleTagDto: UpdateArticleTagDto) {
    const tag = await this.articleTagRepository.findOne({
      where: { id },
    });
    const { categoryId, name } = updateArticleTagDto;
    if (categoryId) {
      tag.categoryId = categoryId;
    }
    tag.name = name;
    return await this.articleTagRepository.save(tag);
  }

  async removeTag(id: number) {
    const tag = await this.articleTagRepository.findOne({ where: { id } });
    return this.articleTagRepository.remove(tag);
  }
}
