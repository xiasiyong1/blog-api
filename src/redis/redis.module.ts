import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';

@Global()
@Module({
  controllers: [RedisController],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',

      async useFactory(configService: ConfigService) {
        const port = configService.get(ConfigEnum.REDIS_PORT);
        const client = createClient({
          socket: {
            host: 'localhost',
            port,
          },
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService]
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
