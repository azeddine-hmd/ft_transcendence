import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Ping Pong Game')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());

  const configService: ConfigService = app.get(ConfigService);

  app.enableCors({
    origin: [
      configService.get('FRONTEND_HOST') as string,
      configService.get('BACKEND_HOST') as string,
    ],
    methods: ['GET', 'POST', 'HEAD', 'OPTIONS', 'DELETE'],
    credentials: true,
  });

  await app.listen(configService.get('PORT') as string);

  Logger.log(`FRONTEND_HOST: ${configService.get('FRONTEND_HOST') as string}`);
  Logger.log(`BACKEND_HOST: ${configService.get('BACKEND_HOST') as string}`);
}

bootstrap();
