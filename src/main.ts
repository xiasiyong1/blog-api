import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypeormFilter } from './filters/typeorm.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new TypeormFilter());
  await app.listen(3000);
}
bootstrap();
