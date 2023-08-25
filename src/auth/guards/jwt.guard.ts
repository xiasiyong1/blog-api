import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigEnum } from 'src/enum/config.enum';
import { JwtToken } from '../../types/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('登录已失效');
    }
    try {
      const payload: JwtToken = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get(ConfigEnum.JWT_SECRET),
      });
      const user = await this.userService.findById(payload.sub);
      // 用户已经登录成功了，但是中途被删除了
      if (!user) {
        throw new UnauthorizedException('登录已失效');
      }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = user;
    } catch {
      throw new UnauthorizedException('登录已失效');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
