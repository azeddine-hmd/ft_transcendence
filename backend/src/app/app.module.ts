import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ChatModule } from '../chat/chat.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { UploadModule } from '../upload/upload.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.postgres.env', '.profile.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        database: configService.get('POSTGRES_DB'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        autoLoadEntities: true,
        synchronize: configService.get('SYCHRONIZE'),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: '/backend/uploads',
      serveRoot: '/api/images',
      serveStaticOptions: {
        index: false,
      },
    }),
    ProfilesModule,
    UsersModule,
    ChatModule,
    UploadModule,
  ],
})
export class AppModule {}
