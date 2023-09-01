import { Test, TestingModule } from '@nestjs/testing';
import { ArticleLikeService } from './article-like.service';

describe('ArticleLikeService', () => {
  let service: ArticleLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleLikeService],
    }).compile();

    service = module.get<ArticleLikeService>(ArticleLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
