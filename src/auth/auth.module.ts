import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { Role } from 'src/role/entities/role.entity';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';

@Global()
@Module({
  imports: [
    UserModule,
    RoleModule,
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          global: true,
          secret: configService.get(ConfigEnum.JWT_SECRET),
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
