import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';
import { ChatModule } from 'src/chat/chat.module';
import { ConfModule } from 'src/conf/conf.module';
import { EnvService } from 'src/conf/env.service';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (envServcie: EnvService) => ({
        type: 'postgres',
        host: envServcie.get('POSTGRES_HOST'),
        port: envServcie.get<number>('POSTGRES_PORT'),
        database: envServcie.get('POSTGRES_DB'),
        username: envServcie.get('POSTGRES_USER'),
        password: envServcie.get('POSTGRES_PASSWORD'),
        autoLoadEntities: true,
        synchronize: envServcie.get('SYCHRONIZE'),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: '/backend/uploads',
      serveRoot: '/api/images',
      serveStaticOptions: {
        index: false,
      },
    }),
    UsersModule,
    ProfilesModule,
    ChatModule,
    GameModule,
  ],
})
export class AppModule {}
