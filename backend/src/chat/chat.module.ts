import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Rooms } from './entities/rooms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Msg } from './entities/msg.entity';
import { Join } from './entities/join.entity';
import { Conversation } from './entities/conversation.entity';
import { DM } from './entities/DM.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({ 
  imports: [TypeOrmModule.forFeature([User, Rooms, Msg, Join, Conversation, DM]), JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (ConfigService: ConfigService) => ({
      secret: ConfigService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: ConfigService.get('JWT_EXPIRATION_DURATION'),
      },
    }),
  }),],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
