import { Injectable } from '@nestjs/common';
import { ArticleCommentDto } from './dto/article-comment.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleComment } from './entities/article-comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleCommentService {
  constructor(
    @InjectRepository(ArticleComment)
    private readonly articleCommentRepository: Repository<ArticleComment>,
  ) {}
  async createComment(
    articleId: number,
    user: User,
    articleCommentDto: ArticleCommentDto,
  ) {
    const articleComment = await this.articleCommentRepository.create({
      ...articleCommentDto,
      articleId,
      userId: user.id,
    });
    return this.articleCommentRepository.save(articleComment);
  }
  async getComments(articleId: number) {
    const comments = await this.articleCommentRepository.find({
      relations: ['userId'],
      where: {
        articleId,
      },
    });
    return comments;
  }
}
