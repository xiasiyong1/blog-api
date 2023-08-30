import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleCategory } from './article-category.entity';
import { ArticleTag } from './article-tag.entity';
import { ArticleComment } from './article-comment.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '标题',
  })
  title: string;

  @Column({
    comment: '封面',
    nullable: true,
  })
  cover: string;

  @Column({
    type: 'varchar',
    length: 120,
    comment: '简介',
  })
  summary: string;

  @Column({
    type: 'longtext',
    comment: '内容',
  })
  content: string;

  @ManyToOne(
    () => ArticleCategory,
    (articleCategory) => articleCategory.articles,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'categoryId' })
  category: ArticleCategory;

  @ManyToMany(() => ArticleTag, (articleTag) => articleTag.article, {
    cascade: true,
  })
  @JoinTable()
  tags: ArticleTag[];

  @OneToMany(() => ArticleComment, (articleComment) => articleComment.article, {
    cascade: true,
  })
  comments: ArticleComment[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  author: User;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
  })
  updateTime: Date;
}
