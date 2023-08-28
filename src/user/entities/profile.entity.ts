import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenderEnum } from 'src/enum/gender.enum';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, type: 'enum', enum: GenderEnum })
  gender: GenderEnum;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    // 注册的时候，保存profile的同时，保存user
    cascade: true,
  })
  @JoinColumn()
  user: User;
}
