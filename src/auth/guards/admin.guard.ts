import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtToken } from '../../types/jwt';
import { ROLES_KEY } from 'src/decorators/role.decorators';
import { RoleEnum } from 'src/enum/role.enum';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const roles = this.reflector.getAllAndMerge<RoleEnum[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    const email = request.body.email;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('账号不存在');
    }
    if (roles.length === 0) {
      return true;
    }
    const can = user.roles.some((role) => roles.includes(role.id));
    if (!can) {
      throw new ForbiddenException('你还不是admin成员');
    }
    return can;
  }
}
