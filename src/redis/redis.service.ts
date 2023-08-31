import { Inject, Injectable } from '@nestjs/common';
import { CreateRediDto } from './dto/create-redi.dto';
import { UpdateRediDto } from './dto/update-redi.dto';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  create(createRediDto: CreateRediDto) {
    return 'This action adds a new redi';
  }

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async incr(key: string) {
    return await this.redisClient.incr(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
