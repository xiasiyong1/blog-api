import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtToken } from '../../types/jwt';
import { ROLES_KEY } from 'src/decorators/role.decorators';
import { Role } from 'src/enum/role.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenInfo: JwtToken = request['user'];
    const roles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (roles.length === 0) {
      return true;
    }
    const user = await this.userService.findOne(tokenInfo.sub);
    const can = user.roles.some((role) => roles.includes(role.id));
    if (!can) {
      throw new ForbiddenException('权限不够');
    }
    return can;
  }
}
