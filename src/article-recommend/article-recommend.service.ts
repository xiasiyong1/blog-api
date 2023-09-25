import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleRecommend } from './entities/article-recommend.entity';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class ArticleRecommendService {
  constructor(
    @InjectRepository(ArticleRecommend)
    private readonly articleRecommendRepository: Repository<ArticleRecommend>,
    @InjectRepository(Article)
    private readonly ArticleRepository: Repository<Article>,
  ) {}
  async recommendArticle(articleId: number, userId: string) {
    const exist = await this.ArticleRepository.exist({
      where: { id: articleId },
    });
    const recommended = await this.articleRecommendRepository.exist({
      where: { articleId: articleId },
    });
    if (!exist) {
      throw new NotFoundException('文章不存在');
    }
    if (recommended) {
      throw new UnauthorizedException('文章已经推荐过了');
    }
    const record = this.articleRecommendRepository.create({
      articleId,
      userId,
    });
    await this.articleRecommendRepository.save(record);
  }
  async removeRecommend(articleId: number) {
    const record = await this.articleRecommendRepository.findOne({
      where: {
        articleId,
      },
    });
    if (!record) {
      throw new NotFoundException('文章不存在');
    }
    await this.articleRecommendRepository.remove(record);
  }

  async getRecommendArticles() {
    const recommends = await this.articleRecommendRepository.find({});
    return recommends;
  }
}
