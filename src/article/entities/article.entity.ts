import { ArticleCategory } from 'src/article-category/entities/article-category.entity';
import { ArticleTag } from 'src/article-tag/entities/article-tag.entity';
import { User } from 'src/user/entities/user.entity';
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

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '标题',
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '文章描述',
  })
  summary: string;

  @Column({
    comment: '文章封面图',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  cover: string;

  @Column({
    type: 'longtext',
    comment: '内容',
  })
  content: string;

  @ManyToOne(() => ArticleCategory, (articleCategory) => articleCategory.id)
  @JoinColumn()
  categoryId: number;

  @ManyToMany(() => ArticleTag, (articleTag) => articleTag.id, {
    cascade: true,
  })
  @JoinTable({ name: 'article_tags' })
  tagIds: number[];

  // @OneToMany(() => ArticleComment, (articleComment) => articleComment.article, {
  //   cascade: true,
  // })
  // comments: ArticleComment[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  userId: string;

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
