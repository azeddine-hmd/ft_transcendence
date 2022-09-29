import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({ 
  imports: [TypeOrmModule.forFeature([User]), JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (ConfigService: ConfigService) => ({
      secret: ConfigService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: ConfigService.get('JWT_EXPIRATION_DURATION'),
      },
    }),
  }),],
  providers: [GameGateway, GameService]
})
export class GameModule {}
