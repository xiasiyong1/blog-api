import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class ArticleCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '分类名称',
  })
  name: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];
}
