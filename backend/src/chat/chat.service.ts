import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { getDataSourceToken, InjectRepository } from '@nestjs/typeorm';
import { Rooms } from './entities/rooms.entity';
import { DataSource, Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { stringify } from 'querystring';
import { JoinRoomDto } from './dto/join-room.dto';
import { CreateMsgDto } from './dto/create-msg.dto';
import { Msg } from './entities/msg.entity';

let roomsusers = new Map<number, number[]>();

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Rooms)
    private readonly roomRepository: Repository<Rooms>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Msg)
    private readonly msgRepository: Repository<Msg>,
  )
  {}
  
  async getRooms() {
    const rooms = await this.roomRepository.find({
      relations: ['owner'],
    });
    
    // let check = await this.userRepository.createQueryBuilder('users')
    // .select()
    // .getOne();
    
    // let ret = await this.roomRepository.createQueryBuilder()
    // .relation(Users, 'rooms')
    // .of(rooms[0])
    // .add(check);
    // let user = this.userRepository.createQueryBuilder().select().getOneOrFail();
    // let room = this.roomRepository.createQueryBuilder().select().getOneOrFail();
    // (await room).joined_users.push(user);
    // (await room).joined_users.forEach(element => {
    //   console.log(element.id + " " + element.name);
      
    // });
    // var usr: any = await this.userRepository.createQueryBuilder().select().where("id = :id", { id: 5 }).getOne();
    // this.roomRepository.createQueryBuilder("room").leftJoinAndSelect("room.joined_users", "ju").getOneOrFail().then((room60) => {
    //     this.userRepository.createQueryBuilder().select().getOneOrFail().then((user5: Users) => {
        
    //     if (usr !== null)
    //     {
    //       //room60.joined_users.push(usr);
    //     }

    //     // this.roomRepository.createQueryBuilder().update({id: room60.id}, room60);
    //     // this.roomRepository.createQueryBuilder().update(Rooms).set({joined_users: [user5]}).where("id = :id", {id: room60.id}).execute();
    //     const ll = this.roomRepository.create({...room60});
    //     this.roomRepository.save(ll);
        

      // });
    // });
    return rooms;

    // if (room60 !== null)
    // {
    //   if (user5 !== null)
    // }
    // let datasource = new DataSource();
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    let check = await this.userRepository.createQueryBuilder('users')
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

  async joinRoom(joinRoomDto: JoinRoomDto) {
    
    let checkuser = await this.userRepository.createQueryBuilder('users')
    .select()
    .where("users.id = :id", { id: joinRoomDto.userId })
    .getOne();
    let checkroom = await this.roomRepository.createQueryBuilder('rooms')
    .select()
    .where("rooms.id = :id", { id: joinRoomDto.roomId })
    .getOne()
    if(checkuser == null)
      return 1;
    else if (checkroom == null)
      return 2;

    return (0);
  }


  async createMsg(createMsgDto: CreateMsgDto) {
    let checkuser = await this.userRepository.createQueryBuilder('users')
    .select()
    .where("users.id = :id", { id: createMsgDto.user })
    .getOne();

    
    if(checkuser == null)
      return 1;
    let checkroom = await this.roomRepository.createQueryBuilder('rooms')
      .select()
      .where("rooms.id = :id", { id: createMsgDto.room })
      .getOne();
    if(checkroom == null)
      return 2;
    const msg = this.msgRepository.create({user: checkuser, room: checkroom, msg: createMsgDto.msg});
    
    await this.msgRepository.save(msg);
    return (3);
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
