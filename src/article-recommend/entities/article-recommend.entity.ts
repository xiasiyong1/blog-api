import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ArticleRecommend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '文章id' })
  articleId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  userId: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @CreateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
