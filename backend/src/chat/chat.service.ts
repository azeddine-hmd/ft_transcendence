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
import { join } from 'path';
import { Join } from './entities/join.entity';
import { ConversationDto } from './dto/conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { DM } from './entities/DM.entity';
import { PrivateMsgDto } from './dto/privateMsg.dto';
import { User } from 'src/users/entities/user.entity';

let roomsusers = new Map<number, number[]>();

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Rooms)
    private readonly roomRepository: Repository<Rooms>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
    @InjectRepository(Msg)
    private readonly msgRepository: Repository<Msg>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(DM)
    private readonly dmRepository: Repository<DM>,
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

  async createRoom(createRoomDto: CreateRoomDto, auth: any) {
    let u1:User = new User();
    let check = await this.userRepository.createQueryBuilder('user')
    .select()
    .where("user.id = :id", { id: auth })
    .getOne()
    createRoomDto.date = new Date();
    u1.id = auth;
    const room = this.roomRepository.create({ ...createRoomDto, owner: u1});
    if(check == null)
      return check;
    await this.roomRepository.save(room);
    let ret = await this.roomRepository.createQueryBuilder('room')
    .leftJoinAndSelect("room.owner", "owner")
    .where("owner.id = :id", { id: auth })
    .where("room.date = :date", { date: createRoomDto.date })
    .getOne()
    return (ret);
  }

  async joinRoom(joinRoomDto: JoinRoomDto, auth: any) {
    
    let checkuser = await this.userRepository.createQueryBuilder('user')
    .select()
    .where("user.id = :id", { id: auth })
    .getOne();
    let checkroom = await this.roomRepository.createQueryBuilder('rooms')
    .select()
    .where("rooms.id = :id", { id: joinRoomDto.roomId })
    .getOne()
    if(checkuser == null)
      return 1;
    else if (checkroom == null)
      return 2;
    // let checkUserJoined = await this.joinRepository.createQueryBuilder('join') // for password rooms
    //   .select()
    //   .where("join.uid = :id", { id: joinRoomDto.userId })
    //   .where("join.rid = :id", { id: joinRoomDto.roomId })
    //   .getOne()
    // if(checkUserJoined == null)
    //   return 3;
    const joinuser = this.joinRepository.create({ "uid": auth, "rid": joinRoomDto.roomId, "user": auth, "room": joinRoomDto.roomId });

    try 
    {
      await this.joinRepository.save(joinuser);
    }
    catch(e)
    {}
    return (0);
  }


  async createMsg(createMsgDto: CreateMsgDto, auth: any) {
    let checkuser = await this.userRepository.createQueryBuilder('user')
    .select()
    .where("user.id = :id", { id: auth })
    .getOne();
    if(checkuser == null)
      return 1;
    let checkroom = await this.roomRepository.createQueryBuilder('rooms')
      .select()
      .where("rooms.id = :id", { id: createMsgDto.room })
      .getOne();
    if(checkroom == null)
      return 2;
    let checkUserJoined = await this.joinRepository.createQueryBuilder('join') // for password rooms
    .where("join.uid = :uid", { uid: auth })
    .andWhere("join.rid = :rid", { rid: createMsgDto.room })
    .select()
    .getOne();
    
    
    if(checkUserJoined == null)
      return 3;
    createMsgDto.date = new Date();
    const msg = this.msgRepository.create({user: checkuser, room: checkroom, msg: createMsgDto.msg, date: createMsgDto.date});
    try{
      await this.msgRepository.save(msg);
    }
    catch(e)
    {}
    
    


    // let ret = await this.roomRepository.createQueryBuilder('room')
    //   .select()
    //   .where("room.id = :id", { id: createMsgDto.room })
    //   .innerJoinAndSelect("room.members", "members")
    //   .where("members.id = :id", { id: createMsgDto.user })
    //   .getOne();
    //   console.log(checkuser);
    //   console.log(ret);
    return (0);
  }


  async getAllMsgsPerRoom(joinRoomDto: JoinRoomDto) {

    let checkUserJoined = await this.msgRepository.createQueryBuilder('msg')
    .leftJoinAndSelect("msg.user", "user")
    .where("msg.room = :rid", { rid: joinRoomDto.roomId })
    .orderBy('msg.id', 'ASC')
    .getMany();
    
    
    if(checkUserJoined == null)
      return null;
    return (checkUserJoined);
  }

  async getRoomById(joinRoomDto: JoinRoomDto) {

    let room = await this.roomRepository.createQueryBuilder('room')
    .where("room.id = :rid", { rid: joinRoomDto.roomId })
    .select()
    .getOne();
    
    if(room == null)
      return null;
    return (room);
  }

  async getUserById(auth:any) {

    let user = await this.userRepository.createQueryBuilder('user')
    .where("user.id = :id", { id: auth })
    .select()
    .getOne();
    
    if(user == null)
      return null;
    return (user);
  }

  async joinToAllUrRooms(uid: number) {
    let checkUserJoined = await this.joinRepository.createQueryBuilder('join') // for password rooms
      .select()
      .where("join.uid = :id", { id: uid })
      .getMany();
    return checkUserJoined;
  }




  async conversation(auth: any) {
    
    let ret = await this.conversationRepository.createQueryBuilder('conversation')
    .innerJoinAndSelect("conversation.user1", "user1")
    .innerJoinAndSelect("conversation.user2", "user2")
    .where("user1.id = :id", { id: auth })
    .orWhere("user2.id = :id2", { id2: auth })
    .getMany();

    return (ret);
  }


  async getPrivateMsg(conversationDto: ConversationDto, auth: any) {
    
    let ret = await this.dmRepository.createQueryBuilder('dm')
    .innerJoinAndSelect("dm.sender", "sender")
    .innerJoinAndSelect("dm.receiver", "receiver")
    .where("(sender.id = :id AND receiver.id = :id2) OR (sender.id = :id2 AND receiver.id = :id)", { id: auth, id2: conversationDto.user })
    .getMany();
    // .where("sender.id = :id", { id: auth })
    // .andWhere("receiver.id = :id2", { id2: conversationDto.user })
    // .orWhere("sender.id = :id3", { id3: conversationDto.user })
    // .andWhere("receiver.id = :id4", { id4: auth })
    // .getMany();

    // console.log(conversationDto.user, auth, ret);
    
    return (ret);
  }

  async createMsgPrivate(privateMsgDto: PrivateMsgDto, auth: any) {
    
    let u1:User = new User(), u2:User = new User();
    let ret = await this.conversationRepository.createQueryBuilder('conversation')
    .innerJoinAndSelect("conversation.user1", "user1")
    .innerJoinAndSelect("conversation.user2", "user2")
    .where("(user1.id = :id AND user2.id = :id2) OR (user1.id = :id2 AND user2.id = :id)", { id: auth, id2: privateMsgDto.user })
    .getOne();
    u1.id = auth;
    u2.id = privateMsgDto.user;
    if (!ret)
    {
      const cnv = this.conversationRepository.create({ user1: u1 , user2: u2 });
      await this.conversationRepository.save(cnv);
    }
    const msg = this.dmRepository.create({ sender: u1, receiver: u2, message: privateMsgDto.msg });
    await this.dmRepository.save(msg);
    // .where("sender.id = :id", { id: auth })
    // .andWhere("receiver.id = :id2", { id2: conversationDto.user })
    // .orWhere("sender.id = :id3", { id3: conversationDto.user })
    // .andWhere("receiver.id = :id4", { id4: auth })
    // .getMany();

    // console.log(conversationDto.user, auth, ret);
    
    
  }

  async getUser(auth: any) {
    
    let checkuser = await this.userRepository.createQueryBuilder('user')
    .select()
    .where("user.id = :id", { id: auth })
    .getOne();
    if(checkuser == null)
      return 1;
    return checkuser;
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
