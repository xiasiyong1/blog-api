import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { ArticleCategory } from './article-category.entity';

@Entity()
export class ArticleTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '标签名称',
  })
  name: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(() => ArticleCategory, (articleCategory) => articleCategory.tags)
  @JoinColumn()
  category: ArticleCategory;

  @ManyToMany(() => Article, (article) => article.tags)
  article: Article;
}
