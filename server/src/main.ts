import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



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

  const config = new DocumentBuilder()
    .setTitle('Rest Api Chat app authentication')
    .setDescription('Rest Api Chat app authentication login register update addFriend Create chat....')
    .setVersion('1.0')
    .addTag('Chat APP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(3001);
}

bootstrap();
