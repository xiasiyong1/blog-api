import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/role/entities/role.entity';
import { FindUserDto } from './dto/find-user-dto';
import { GenderEnum } from 'src/enum/gender.enum';

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

  async findAll(findUserDto: FindUserDto) {
    const take = +findUserDto.pageSize || 10;
    const currentPage = +findUserDto.currentPage || 1;
    const username = findUserDto.username;
    const email = findUserDto.email;
    const skip = (currentPage - 1) * take;

    const where: FindOptionsWhere<User> = {
      profile: {
        gender: findUserDto.gender || GenderEnum.UN_KNOWN,
      },
    };

    if (username) {
      where.profile['username'] = Like(`%${username}%`);
    }

    if (email) {
      where.email = Like(`%${email}%`);
    }

    if (findUserDto.roles) {
      where.roles = {
        id: In(findUserDto.roles),
      };
    }

    const [userList, count] = await this.userRepository.findAndCount({
      relations: { roles: true, profile: true },
      take,
      skip,
      where,
    });
    return {
      userList,
      count,
    };
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
      relations: { roles: true },
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
