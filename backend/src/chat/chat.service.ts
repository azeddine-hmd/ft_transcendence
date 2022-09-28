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



/*********************************************CHAT TOOLS*********************************************/

  async checkUser(auth: any)
  {
    let checkuser = await this.userRepository.createQueryBuilder('user')
    .select()
    .where("user.userId = :id", { id: auth })
    .getOne();
    return checkuser;
  }

  async checkUserById(auth: any)
  {
    let checkuser = await this.userRepository.createQueryBuilder('user')
    .select()
    .where("user.id = :id", { id: auth })
    .getOne();
    return checkuser;
  }

  async checkUserProfileById(auth: any)
  {
    let checkuser = await this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect("user.profile", "profile")
    .where("user.id = :id", { id: auth })
    .getOne();
    return checkuser;
  }

  async checkUserProfileByUserId(auth: any)
  {
    let checkuser = await this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect("user.profile", "profile")
    .where("user.userId = :id", { id: auth })
    .getOne();
    return checkuser;
  }

  async checkJoined(id: number, room: number)
  {
    let checkUserJoined = await this.joinRepository.createQueryBuilder('join')
    .where("join.uid = :uid", { uid: id })
    .andWhere("join.rid = :rid", { rid: room })
    .select()
    .getOne();
    return checkUserJoined;
  }
  
  /**************ROOMS TOOLS**************/

  async checkRoom(roomId: number)
  {
    let checkroom = await this.roomRepository.createQueryBuilder('rooms')
    .select()
    .where("rooms.id = :id", { id: roomId })
    .getOne()
    return checkroom;
  }

  async checkProtectedRoomPassword(joinRoomDto: JoinRoomDto)
  {
    let checkroom = await this.roomRepository.createQueryBuilder('rooms')
    .select()
    .where("rooms.id = :id", { id: joinRoomDto.roomId })
    .andWhere("rooms.password = :password", {password: joinRoomDto.password})
    .getOne()
    return checkroom;
  }


  async getRooms() {
    const rooms = await this.roomRepository.find({
      relations: ['owner'],
    });
    return rooms;
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

  async getRoomByOwner(id: number, date: Date) {
    let ret = await this.roomRepository.createQueryBuilder('room')
    .leftJoinAndSelect("room.owner", "owner")
    .where("owner.id = :id", { id: id })
    .andWhere("room.date = :date", { date: date })
    .getOne()
    if(ret == null)
      return null;
    return (ret);
  }

  async joinToAllUrRooms(auth: string) {
    let checkUserJoined = await this.joinRepository.createQueryBuilder('join') // for password rooms
      .innerJoinAndSelect("join.user", "user")
      .select()
      .where("user.userId = :userId", { userId: auth })
      .getMany();
    return checkUserJoined;
  }

  async getAllMsgsPerRoom(joinRoomDto: JoinRoomDto) {
    let checkUserJoined = await this.msgRepository.createQueryBuilder('msg')
    .leftJoinAndSelect("msg.user", "user")
    .leftJoinAndSelect("user.profile", "profile")
    .where("msg.room = :rid", { rid: joinRoomDto.roomId })
    .orderBy('msg.id', 'ASC')
    .getMany();
    if(checkUserJoined == null)
      return null;

    return (checkUserJoined);
  }

  /************END ROOMS TOOLS************/


  /***************DM TOOLS****************/

  async conversation(auth: any) {
    let ret = await this.conversationRepository.createQueryBuilder('conversation')
    .innerJoinAndSelect("conversation.user1", "user1")
    .innerJoinAndSelect("user1.profile", "profile1")
    .innerJoinAndSelect("conversation.user2", "user2")
    .innerJoinAndSelect("user2.profile", "profile2")
    .where("user1.userId = :id", { id: auth })
    .orWhere("user2.userId = :id2", { id2: auth })
    .getMany();
    return (ret);
  }

  async getPrivateMsg(conversationDto: ConversationDto, auth: any) {
    let ret = await this.dmRepository.createQueryBuilder('dm')
    .innerJoinAndSelect("dm.sender", "sender")
    .innerJoinAndSelect("sender.profile", "profile1")
    .innerJoinAndSelect("dm.receiver", "receiver")
    .innerJoinAndSelect("receiver.profile", "profile2")
    .where("(sender.userId = :id AND receiver.userId = :id2) OR (sender.userId = :id2 AND receiver.userId = :id)", { id: auth, id2: conversationDto.user })
    .getMany();   
    return (ret);
  }

  /*************END DM TOOLS**************/


/*******************************************END CHAT TOOLS*******************************************/



/***********************************CHAT ROOMS PUBLIC AND PROTECTED**********************************/

  async createRoom(createRoomDto: CreateRoomDto, auth: any) {
    let u1:User = new User();
    let checkuser = await this.checkUser(auth);
    if(!checkuser)
      return checkuser;
    createRoomDto.date = new Date();
    u1.id = checkuser.id;
    const room = this.roomRepository.create({ ...createRoomDto, owner: u1});
    await this.roomRepository.save(room);
    let ret = await this.getRoomByOwner(u1.id, createRoomDto.date);
    return (ret);
  }

  async joinRoom(joinRoomDto: JoinRoomDto, auth: any) {
    let u1:User = new User();
    let checkuser = await this.checkUser(auth);
    if(checkuser == null)
      return 1;
    let checkroom = await this.checkRoom(joinRoomDto.roomId);
    if (checkroom == null)
      return 2;
    if (joinRoomDto.privacy)
    {
      let checkroomPass = await this.checkProtectedRoomPassword(joinRoomDto);
      if (checkroomPass == null)
        return 3;
    }
    u1.id = checkuser.id;
    const joinuser = this.joinRepository.create({ "uid": u1.id, "rid": joinRoomDto.roomId, "user": { ...u1}, "room": joinRoomDto.roomId });
    try{await this.joinRepository.save(joinuser);}catch(e){}
    return (0);
  }

  async createMsg(createMsgDto: CreateMsgDto, auth: any) {
    let checkuser = await this.checkUser(auth);
    if(checkuser == null)
      return 1;
    let checkroom = await this.checkRoom(createMsgDto.room);
    if (checkroom == null)
      return 2;
    let checkUserJoined = await this.checkJoined(checkuser.id, createMsgDto.room);
    if(checkUserJoined == null)
      return 3;
    createMsgDto.date = new Date();
    const msg = this.msgRepository.create({user: checkuser, room: checkroom, msg: createMsgDto.msg, date: createMsgDto.date});
    try{await this.msgRepository.save(msg);}catch(e){}
    return (0);
  }

/*********************************END CHAT ROOMS PUBLIC AND PROTECTED********************************/



/*********************************************DM SERVICE*********************************************/

  async createMsgPrivate(privateMsgDto: PrivateMsgDto, auth: any) {
    let u1:User = new User(), u2:User = new User();
    let ret = await this.conversationRepository.createQueryBuilder('conversation')
    .innerJoinAndSelect("conversation.user1", "user1")
    .innerJoinAndSelect("user1.profile", "profile1")
    .innerJoinAndSelect("conversation.user2", "user2")
    .innerJoinAndSelect("user2.profile", "profile2")
    .where("(user1.id = :id AND user2.userId = :id2) OR (user1.userId = :id2 AND user2.id = :id)", { id: auth, id2: privateMsgDto.user })
    .getOne();
    u1.id = auth;
    u2.userId = privateMsgDto.user;
    if (!ret)
    {
      const cnv = this.conversationRepository.create({ user1: u1 , user2: u2 });
      await this.conversationRepository.save(cnv);
    }
    const msg = this.dmRepository.create({ sender: u1, receiver: u2, message: privateMsgDto.msg });
    await this.dmRepository.save(msg);
  }

/*******************************************END DM SERVICE*******************************************/


}
