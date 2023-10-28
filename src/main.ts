import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { envVariables } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(envVariables.cookieSecret));
  app.use(helmet({
    contentSecurityPolicy: envVariables.nodeEnv === 'production'
  }));

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(envVariables.port);
}

bootstrap();
