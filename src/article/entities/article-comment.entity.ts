import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
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
    nullable: true,
  })
  // 七牛的oss应该不只是一个string，到时候再改吧
  images: string;

  @CreateDateColumn()
  createTime: Date;

  @ManyToOne(() => Article, (article) => article.comments)
  @JoinColumn()
  article: Article;

  // todo 验证这个user.id能不能行
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;
}
