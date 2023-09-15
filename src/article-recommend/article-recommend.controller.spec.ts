import { Test, TestingModule } from '@nestjs/testing';
import { ArticleRecommendController } from './article-recommend.controller';
import { ArticleRecommendService } from './article-recommend.service';

describe('ArticleRecommendController', () => {
  let controller: ArticleRecommendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleRecommendController],
      providers: [ArticleRecommendService],
    }).compile();

    controller = module.get<ArticleRecommendController>(ArticleRecommendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
