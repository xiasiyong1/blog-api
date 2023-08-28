import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypeormFilter } from './filters/typeorm.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new TypeormFilter());
  // 使用 class-validator验证controller中接收的参数
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤dto中没有申明的字段
    }),
  );
  await app.listen(3000);
}
bootstrap();
