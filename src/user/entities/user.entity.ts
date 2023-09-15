import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Exclude } from 'class-transformer';
import { GenderEnum } from 'src/enum/gender.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    comment: '邮箱',
    nullable: true,
  })
  email: string;

  @Column({
    unique: true,
    comment: '电话',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '密码',
  })
  @Exclude()
  password: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '用户名称',
    nullable: true,
  })
  username: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    comment: '女：1， 男：2，未知：3',
    default: GenderEnum.UN_KNOWN,
  })
  gender: GenderEnum;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
