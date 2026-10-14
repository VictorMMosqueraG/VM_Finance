import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { API_PREFIX, APP_TIMEZONE } from '@vm-finance/shared';
import { AppModule } from './app.module.js';

process.env.TZ ??= APP_TIMEZONE;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(API_PREFIX);
  app.enableCors({
    origin: (process.env.FRONTEND_URL ?? 'http://localhost:4200').split(','),
    credentials: true,
  });
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  Logger.log(`API lista en http://localhost:${port}/${API_PREFIX}`, 'Bootstrap');
}

await bootstrap();
