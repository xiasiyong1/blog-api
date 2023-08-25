import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class ArticleComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '评论内容',
  })
  content: string;

  @Column()
  // 七牛的oss应该不只是一个string，到时候再改吧
  images: string;

  @CreateDateColumn()
  createTime: Date;

  @ManyToOne(() => Article, (article) => article.comments)
  @JoinColumn()
  article: Article;
}
