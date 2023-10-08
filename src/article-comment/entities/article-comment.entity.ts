import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';

@Entity()
export class ArticleComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 300,
    comment: '评论内容',
  })
  content: string;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '评论图片',
    nullable: true,
  })
  images: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @ManyToOne(() => Article, (article) => article.id, { nullable: false })
  @JoinColumn({})
  articleId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
