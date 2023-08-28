import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}
  async create() {
    const user = this.userRepository.create({
      email: '1233@qq.com',
      password: '123456',
    });
    this.userRepository.create(user);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({
      relations: { profile: true, roles: true },
    });
    return `This action returns all user`;
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { profile: true, roles: true },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    let profile = await this.profileRepository.findOne({
      where: { user: { id } },
    });
    profile = this.profileRepository.merge(profile, updateProfileDto);
    return this.profileRepository.save(profile);
  }
  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    const { roleIds } = updateRoleDto;
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const roles = await this.roleRepository.find({
      where: {
        id: In(roleIds),
      },
    });
    user.roles = roles;
    return this.userRepository.save(user);
  }
}
