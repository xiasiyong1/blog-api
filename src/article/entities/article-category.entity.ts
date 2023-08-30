import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { ArticleTag } from './article-tag.entity';

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

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.category)
  tags: ArticleTag[];

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];
}
