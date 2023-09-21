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
import { RoleEnum } from 'src/enum/role.enum';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request['user'];
    const roles = this.reflector.getAllAndMerge<RoleEnum[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (roles.length === 0) {
      return true;
    }
    const userRoleIds = user.roles.map((role) => role.id);
    if (userRoleIds.includes(RoleEnum.SUPER_ADMIN)) {
      return true;
    }
    const can = userRoleIds.some((id) => roles.includes(id));
    if (!can) {
      throw new ForbiddenException('你还不是admin成员');
    }
    return can;
  }
}
