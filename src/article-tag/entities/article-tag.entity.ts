import { ArticleCategory } from 'src/article-category/entities/article-category.entity';
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

@Entity()
export class ArticleTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '标签名称',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  name: string;

  @ManyToOne(() => ArticleCategory, (articleCategory) => articleCategory.id)
  @JoinColumn({
    name: 'categoryId',
  })
  categoryId: number;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
