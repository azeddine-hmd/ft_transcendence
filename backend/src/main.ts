import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // global modules setup
  app.useGlobalPipes(new ValidationPipe());

  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('Ping Pong online Game')
    .setDescription('Ping Pong online backend service api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORS setup
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
  });

  await app.listen(8080);
}

bootstrap();
