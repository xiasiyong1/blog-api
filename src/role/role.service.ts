import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findRoles(name: string) {
    const where: FindOptionsWhere<Role> = {};
    if (name) {
      where.name = Like(`%${name}%`);
    }
    return this.roleRepository.find({
      where,
    });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    let role = await this.roleRepository.findOne({ where: { id } });
    role = this.roleRepository.merge(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    return this.roleRepository.remove(role);
  }
}
