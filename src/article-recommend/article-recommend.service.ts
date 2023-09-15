import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleRecommend } from './entities/article-recommend.entity';

@Injectable()
export class ArticleRecommendService {
  constructor(
    @InjectRepository(ArticleRecommend)
    private readonly articleRecommendRepository: Repository<ArticleRecommend>,
  ) {}
  async recommendArticle(articleId: number) {
    const record = this.articleRecommendRepository.create({
      articleId,
    });
    return this.articleRecommendRepository.save(record);
  }
  async getRecommendArticles() {
    const recommends = await this.articleRecommendRepository.find({
      relations: ['articleId'],
    });
    return recommends;
  }
}
