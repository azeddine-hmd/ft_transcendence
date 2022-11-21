import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { EnvService } from './conf/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Ping Pong Game')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const envService = app.get(EnvService);

  envService.get('FRONTEND_HOST');

  app.enableCors({
    origin: [envService.get('FRONTEND_HOST'), envService.get('BACKEND_HOST')],
    methods: ['GET', 'POST', 'HEAD', 'OPTIONS', 'DELETE'],
    credentials: true,
  });

  await app.listen(envService.get<number>('PORT'));

  Logger.log(`BACKEND_HOST: ${envService.get('BACKEND_HOST')}`);
}

bootstrap();
