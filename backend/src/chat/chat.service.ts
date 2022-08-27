import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from './entities/rooms.entity';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Rooms)
    private readonly roomRepository: Repository<Rooms>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  )
  {}
  
  async getRooms() {
    const rooms = await this.roomRepository.find({
      relations: ['owner'],
    });
    return rooms;
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    let check = await this.usersRepository.createQueryBuilder('users')
    .select()
    .where("users.id = :id", { id: createRoomDto.owner.id })
    .getOne()
    createRoomDto.date = new Date();
    const room = this.roomRepository.create(createRoomDto);
    if(check == null)
      return check;
    await this.roomRepository.save(room);
    let ret = await this.roomRepository.createQueryBuilder('room')
    .leftJoinAndSelect("room.owner", "owner")
    .where("owner.id = :id", { id: createRoomDto.owner.id })
    .where("room.date = :date", { date: createRoomDto.date })
    .getOne()
    return (ret);
  }

  // create(createRoomDto: CreateRoomDto) {
  //   return 'This action adds a new chat';
  // }

  // findAll() {
  //   return `This action returns all chat`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }


}
