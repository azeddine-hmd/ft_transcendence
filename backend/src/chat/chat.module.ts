import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Conversation } from './entities/conversation.entity';
import { DM } from './entities/DM.entity';
import { Join } from './entities/join.entity';
import { Msg } from './entities/msg.entity';
import { Rooms } from './entities/rooms.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, Rooms, Msg, Join, Conversation, DM]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
