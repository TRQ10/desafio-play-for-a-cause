import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';



async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['POST', 'PUT', 'DELETE', 'GET']
  });

  await app.listen(3001);
}

bootstrap();
