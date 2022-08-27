import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Users } from './entities/users.entity';
import { Rooms } from './entities/rooms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms])],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
