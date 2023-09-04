import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class ArticleComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '评论内容',
  })
  content: string;

  @Column({
    comment: '评论图片',
    nullable: true,
  })
  images: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(() => Article, (article) => article.id, { nullable: false })
  @JoinColumn({})
  article: Article;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn()
  user: User;
}
