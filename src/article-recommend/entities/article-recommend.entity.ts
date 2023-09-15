import { Article } from 'src/article/entities/article.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ArticleRecommend {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Article, (article) => article.id)
  @JoinColumn()
  articleId: number;

  @Column({
    type: 'int',
    default: 0,
  })
  sort: number;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @CreateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
