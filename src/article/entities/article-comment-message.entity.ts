import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleComment } from './article-comment.entity';

@Entity()
export class ArticleCommentMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '消息内容',
  })
  content: string;

  @Column({
    comment: '评论图片',
  })
  @CreateDateColumn()
  createTime: Date;

  @Column()
  commentId: number;

  @Column()
  from: string;

  @Column()
  to: string;
}
