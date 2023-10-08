import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/role/entities/role.entity';
import { FindUserDto } from './dto/find-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SuperAdminUpdateUserDto } from './dto/super-admin-update-user.dto';
import { RoleEnum } from 'src/enum/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
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

    const where: FindOptionsWhere<User> = {};

    if (username) {
      where.username = Like(`%${username}%`);
    }

    if (email) {
      where.email = Like(`%${email}%`);
    }

    if (findUserDto.roleIds) {
      where.roles = {
        id: In(findUserDto.roleIds),
      };
    }

    const [userList, count] = await this.userRepository.findAndCount({
      relations: { roles: true },
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
      relations: { roles: true },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      relations: { roles: true },
      where: {
        id,
      },
    });
    if (
      user.roles &&
      user.roles.find((item) => item.id === RoleEnum.SUPER_ADMIN)
    ) {
      throw new BadRequestException('超级管理员不可删除');
    }
    return this.userRepository.remove(user);
  }
  findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: { roles: true },
    });
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
    await this.userRepository.save(user);
  }
  async update(id: string, updateUserDto: UpdateUserDto, roleIds?: number[]) {
    let user = await this.findById(id);
    const { ...rest } = updateUserDto;
    if (roleIds) {
      user.roles = await this.roleRepository.find({
        where: {
          id: In(roleIds),
        },
      });
    }
    user = this.userRepository.merge(user, rest);
    await this.userRepository.save(user);
  }
}
