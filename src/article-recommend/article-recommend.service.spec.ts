import { Test, TestingModule } from '@nestjs/testing';
import { ArticleRecommendService } from './article-recommend.service';

describe('ArticleRecommendService', () => {
  let service: ArticleRecommendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleRecommendService],
    }).compile();

    service = module.get<ArticleRecommendService>(ArticleRecommendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
