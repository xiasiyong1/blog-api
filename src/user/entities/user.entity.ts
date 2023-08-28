import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Role } from 'src/role/entities/role.entity';
import { Exclude } from 'class-transformer';

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
    comment: '密码',
  })
  @Exclude()
  password: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @ManyToMany(() => Role, (role) => role.users, {
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  roles: Role[];
}
