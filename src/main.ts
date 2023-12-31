import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypeormFilter } from './filters/typeorm.filter';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FormatResponseInterceptor } from './interceptors/format-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new TypeormFilter());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // 使用 class-validator验证controller中接收的参数
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤dto中没有申明的字段
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/static',
  });
  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
}
bootstrap();
