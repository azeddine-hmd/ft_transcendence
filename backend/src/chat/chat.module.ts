import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Users } from './entities/users.entity';
import { Rooms } from './entities/rooms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Msg } from './entities/msg.entity';
import { Join } from './entities/join.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms, Msg, Join])],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
