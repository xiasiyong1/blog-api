import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class ArticleTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '标签名称',
    unique: true,
  })
  name: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Article, (article) => article.tags)
  article: Article;
}
