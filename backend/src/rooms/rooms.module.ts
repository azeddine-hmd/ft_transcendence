import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from './entities/rooms.entity';
import { Users } from './entities/users.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';


@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms])],
  controllers: [RoomsController],
  providers: [RoomsService]
})
export class RoomsModule {}
