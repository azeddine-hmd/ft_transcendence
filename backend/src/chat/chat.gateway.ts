import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { flatten, NotFoundException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { JoinRoomDto } from './dto/join-room.dto';
import { CreateMsgDto } from './dto/create-msg.dto';
import { ConversationDto } from './dto/conversation.dto';
import { PrivateMsgDto } from './dto/privateMsg.dto';
import { arrayBuffer } from 'stream/consumers';
import { atob } from 'buffer';
import { User } from 'src/users/entities/user.entity';
import { JwtAuth } from 'src/auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'src/profiles/entities/profile.entity';
import { use } from 'passport';
import { UpdateRoomDto } from './dto/update-rooms.dto';
import { AddRoleToSomeUserDto } from './dto/addRoleToSomeUser.dto';
import { inBlockedList } from './tools/tools';
import { BanDto } from './dto/ban.dto';
import { WsExceptionFilter } from 'src/filter/ws-filter';
import cookieParser from 'cookie-parser';
import { disconnect } from 'process';
import { KickDto } from './dto/kick.dto';

let usersClient:Map<string, string[] | undefined> = new Map();
let roomClients:Map<string, string[] | undefined> = new Map();
function getClientId(client: Socket, jwt: JwtService): number
{
  try {
    let auth:any = "";
    let tmp;
    if (client.handshake.headers.cookie)
      auth =  client.handshake.headers.cookie.split('=')[1];
    
    console.log("clientid", auth);
    
    const claims = atob(auth.split('.')[1]);
    tmp = JSON.parse(claims);
    return (tmp.userId);
    
  } catch (error) {
    
    return (0);
  }
  //jwt.verify(auth);
}

class roomModel {
  id: number;
  title : string;
  description : string;
  members : string;
  privacy: boolean;
  admin: string;
}

class clientObj {
  id: string;
  clientId: string[];
}

class dmModel {
  userId: string;
  username: string;
  msg: string;
  avatar: string;
  currentUser: boolean;
  date: string;
}

class userModel{
  userId:string | undefined;
  username:string | undefined;
  avatar:string | null | undefined;
  displayName: string | undefined;
};

class msgModel{
  userId:string | undefined;
  username:string | undefined;
  avatar:string | null | undefined;
  date:string;
  msg:string;
  currentUser:boolean;
};

@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
  cookie: true,
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService, private readonly jwtService: JwtService) {}

/***********************PUBLIC AND PROTECTED SUBSCRIBE MESSAGE***********************/


  @SubscribeMessage('createRoom')
  async  createRoom(@MessageBody() createRoomDto: CreateRoomDto, @ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client, this.jwtService);
    console.log("current user", await this.chatService.checkUser(clientId));
    
    let test =  await this.chatService.createRoom(createRoomDto, clientId);
    console.log(createRoomDto);
    if(test == null)
      this.server.emit('createRoom', { created: false });
    else
      this.server.emit('createRoom', {  created: true });
  }

  @SubscribeMessage('updateRoom')
  async  updateRoom(@MessageBody() updateRoomDto: UpdateRoomDto, @ConnectedSocket() client: Socket) {
    console.log(updateRoomDto);
    
    let clientId:any =  getClientId(client, this.jwtService);
    let test =  await this.chatService.updateRoom(updateRoomDto, clientId);
    if(test == 1)
      this.server.emit('updateRoom', { success: false, error: "User not found" });
    else if (test == 2)
      this.server.emit('updateRoom', { success: false, error: "Room not found" });
    else if (test == 3)
      this.server.emit('updateRoom', { success: false, error: "This room have another owner" });
    else
      this.server.emit('updateRoom', { success: true, error: "" });
  }

  @SubscribeMessage('addRoleToSomeUser')
  async  addRoleToSomeUser(@MessageBody() addRoleToSomeUserDto: AddRoleToSomeUserDto, @ConnectedSocket() client: Socket) {
    console.log(addRoleToSomeUserDto);
    
    let clientId:any =  getClientId(client, this.jwtService);
    let test =  await this.chatService.addRoleToSomeUser(addRoleToSomeUserDto, clientId);
    console.log(test);
    
    if(test == 1)
      this.server.to(client.id).emit('addRoleToSomeUser', { success: false, error: "User not found" });
    else if (test == 2)
    {
      console.log('here');
      
      this.server.to(client.id).emit('addRoleToSomeUser', { success: false, error: `${addRoleToSomeUserDto.username} not found` });
    }
    else if (test == 3)
      this.server.to(client.id).emit('addRoleToSomeUser', { success: false, error: "room not found" });
    else if (test == 4)
      this.server.to(client.id).emit('addRoleToSomeUser', { success: false, error: "This room have another owner" });
    else if (test == 5)
      this.server.to(client.id).emit('addRoleToSomeUser', { success: false, error: `${addRoleToSomeUserDto.username} doesn't join this room` });
    else
      this.server.to(client.id).emit('addRoleToSomeUser', { success: true, error: "" });
  }


  @SubscribeMessage('joinRoom')
  async  joinRoom(@MessageBody() joinRoomDto: JoinRoomDto, @ConnectedSocket() client: Socket)
  {
    let messages:msgModel[] = [];
    let clientId:any =  getClientId(client, this.jwtService);
    let join =  await this.chatService.joinRoom(joinRoomDto, clientId);
    if (join == 1)
      this.server.to(client.id).emit('joinRoom', { role: "", room: -1, error: "user not found", msgs: null });
    else if (join == 2)
      this.server.to(client.id).emit('joinRoom', { role: "", room: -1, error: "room not found", msgs: null });
    else if (join == 3)
      this.server.to(client.id).emit('joinRoom', { role: "", room: -1, error: "password incorrect", msgs: null });
    else if (join > 9)
      this.server.to(client.id).emit('joinRoom', { role: "", room: -1, error: "the administrator baned you " + (join / 10) + "H", msgs: null });
    else
    {
      // client.join(joinRoomDto.roomId.toString());
      // roomClients.set(joinRoomDto.roomId.toString(), )
      if (roomClients.get(joinRoomDto.roomId.toString()) === undefined)
        roomClients.set(joinRoomDto.roomId.toString(), [clientId]);
      else
      {
        let arr: string[] | undefined = new Array();
        arr = roomClients.get(joinRoomDto.roomId.toString());
        if (arr)
        {

          let bl = 0;
          console.log(roomClients);
          arr.forEach(element => {
            if (element == clientId)
              bl = 1;
          });
          if (bl == 0)
          {
            arr?.push(clientId);
            roomClients.set(joinRoomDto.roomId.toString(), arr);
          }
          
        }
      }
      
      const userRole = await this.chatService.getMemberRole(joinRoomDto, clientId);
      const roomInfo = await this.chatService.getRoomById(joinRoomDto.roomId);
      
      const msgs = await this.chatService.getAllMsgsPerRoom(joinRoomDto);
      const blockedUsers = await this.chatService.getBlockedUsers(clientId);
      
      try{    
        if (msgs)
        {
          for (let index = 0; index < msgs.length; index++) {
            if (inBlockedList(blockedUsers, msgs[index].user.id))
              continue;
            let tmp:msgModel =new msgModel();
            let date:string[] = msgs[index].date.toString().split(':');
            let dateMsg:string = date[0] + ':' + date[1].split(' ')[0];
            // tmp.userId = msgs[index].user.userId;
            tmp.msg = msgs[index].msg;
            tmp.date = dateMsg;
            tmp.username = msgs[index].user.username;
            tmp.avatar = msgs[index].user.profile.avatar;
            tmp.currentUser = (msgs[index].user.userId == clientId);
            messages.push(tmp);
          }
          this.server.to(client.id).emit('joinRoom', { role: userRole?.role, room: roomInfo,  error: "", msgs: messages });
        }
      }
      catch(e){ console.log(e); }
    }
  }

  @SubscribeMessage('findAllRooms')
  async getRooms(@ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client, this.jwtService);
    try {
      const rooms = await this.chatService.getRooms();
      let arr:any = new Array();
      rooms.forEach(element => {
        let rm:roomModel = new roomModel();
        rm.id = element.id;
        rm.admin = element.owner.userId;
        rm.title = element.title;
        rm.description = element.description;
        rm.privacy = element.privacy;
        arr.push(rm);
      });
      if (!rooms)
        this.server.to(client.id).emit('findAllRooms', { error: "something went wrong" });
      this.server.to(client.id).emit('findAllRooms', { rooms: arr });
    } catch (error) {
      console.error(error);
    }
    return;
  }

  @SubscribeMessage('createMsg')
  async  createMsg(@MessageBody() createMsgDto: CreateMsgDto, @ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client, this.jwtService);

    let test =  await this.chatService.createMsg(createMsgDto, clientId);
    if(test == 1)
      this.server.to(client.id).emit('createMsg', { created: false, error: "user not found!" });
    else if (test == 2)
      this.server.to(client.id).emit('createMsg', { created: false, error: "room not found!" });
    else if (test == 3)
      this.server.to(client.id).emit('createMsg', { created: false, error: "u didn't join this room!" });
    else if (test > 9)
      this.server.to(client.id).emit('createMsg', { created: false, error: "the administrator baned you " + (test / 10) + "H" });
    else if (test > 109)
      this.server.to(client.id).emit('createMsg', { created: false, error: "the administrator Muted you " + (test / 100) + "H" });
    else
    {
      client.join(createMsgDto.room.toString());
      const userInfo:User | null = await this.chatService.checkUserProfileByUserId(clientId);

      try{
        if (!userInfo) return;
        let tmp:msgModel = new msgModel();
        let date = createMsgDto.date.toString().split(':');
        let dateMsg = date[0] + ':' + date[1].split(' ')[0];
        tmp.userId = userInfo.userId;
        tmp.date = dateMsg;
        tmp.msg = createMsgDto.msg;
        tmp.username = userInfo.username;


        tmp.avatar = userInfo.profile.avatar;
        tmp.currentUser = false;
        
        // client.broadcast.to(createMsgDto.room.toString()).emit('createMsg', { created: true, room: createMsgDto.room, tmp });
        // this.server.to(client.id).emit('createMsg', { created: true, room: createMsgDto.room, tmp });
        const roomid:string | string[] = createMsgDto.room.toString();
        if (roomid == undefined)
          return;
        else{
          let room = roomClients.get(roomid);
          if (room !== undefined)
          {

            for (let i = 0; i < room.length; i++) {
              const element = room[i];
              if (clientId == element)
                continue;
              const isbck = await this.chatService.isblock(element, clientId);
              if (isbck)
                continue;
              const clientIds: string[] | undefined = usersClient.get(element);
              if (clientIds)
                this.server.to( clientIds ).emit('createMsg', { created: true, room: createMsgDto.room, tmp });
            }
            //client.broadcast.to(roomClients.get(roomid)).emit('createMsg', { created: true, room: createMsgDto.room, tmp });
            tmp.currentUser = true;
            this.server.to(client.id).emit('createMsg', { created: true, room: createMsgDto.room, tmp });
          }
        }
      }
      catch(e){}
    }
  }


/*********************END PUBLIC AND PROTECTED SUBSCRIBE MESSAGE*********************/



/********************************DM SUBSCRIBE MESSAGE********************************/

  /* 
    when the you user DM another user, I add them to
    "conversation" table, in this subscribe message i emit all the users that
    the current user talk with them 
  */
  @SubscribeMessage('conversation')
  async  conversation(@ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client, this.jwtService);

    /*
      get from the conversation table in the database
      all the users that the current user talk with them
    */
    let test =  await this.chatService.conversation(clientId);
    const blockedUsers = await this.chatService.getBlockedUsers(clientId);
    let arr = new Array();
    
    if (test.length > 0)
    {
      test.forEach(element => {
        if (!inBlockedList(blockedUsers, element.user1.userId == clientId ?  element.user2.id : element.user1.id))
        {
          let userConversation:userModel = new userModel();        
          if (element.user1.userId == clientId)
          {
            userConversation.avatar = element.user2.profile.avatar;
            userConversation.displayName = element.user2.profile.displayName;
            userConversation.userId = element.user2.userId;
            userConversation.username = element.user2.username;
            arr.push(userConversation);
          }
          else
          {
            userConversation.avatar = element.user1.profile.avatar;
            userConversation.displayName = element.user1.profile.displayName;
            userConversation.userId = element.user1.userId;
            userConversation.username = element.user1.username;
            arr.push(userConversation);
          }
        }
      });
    }
    this.server.to(client.id).emit('conversation', arr);
  }

  /*
    get all private message related to some user
  */
  @SubscribeMessage('getPrivateMsg')
  async  getPrivateMsg(@MessageBody() conversationDto: ConversationDto, @ConnectedSocket() client: Socket) { 
    let clientId:any =  getClientId(client, this.jwtService);
    
    let test = await this.chatService.getPrivateMsg(conversationDto, clientId);
    const blockedUsers = await this.chatService.getBlockedUsers(clientId);
    
    if (!test)
    {
      this.server.to(client.id).emit('getPrivateMsg', {success: false, error: "user not found"});
      return;
    }
    let arr = new Array();
    test.forEach(element => {
      if (!inBlockedList(blockedUsers, element.sender.userId == clientId ?  element.receiver.id : element.sender.id))
      {
        let dm: dmModel = new dmModel();
        dm.userId = element.sender.userId;
        dm.username = element.sender.username;
        dm.msg = element.message;
        dm.avatar = element.sender.profile.avatar;
        let date = element.date.toString().split(':');
        dm.date = date[0] + ':' + date[1].split(' ')[0];
        dm.currentUser = (element.sender.userId == clientId) ? true : false;
        arr.push(dm);
      }
    });
    let u = await this.chatService.checkUserByUserName(conversationDto.user);
    
    this.server.to(client.id).emit('getPrivateMsg', {success: true, error: "", privateMessages: arr, username: u?.username, userId: u?.userId});
  }

  /*
    add new private message related to some user to DM table in the database
  */
  @SubscribeMessage('createnNewPrivateMsg')
  async  createMsgPrivate(@MessageBody() privateMsgDto:  PrivateMsgDto, @ConnectedSocket() client: Socket) {
    
    let clientId:any =  getClientId(client, this.jwtService);
    const blockedUsers = await this.chatService.getBlockedUsers(clientId);
    const usr:User | null = await this.chatService.checkUserByUserName(privateMsgDto.user);
    if (usr && inBlockedList(blockedUsers, usr.id))
      return;
    if(!(await this.chatService.createMsgPrivate(privateMsgDto, clientId)))
    {
      this.server.to(client.id).emit("receiveNewPrivateMsg", {error: "Something went wrong: the message is not inserted"});
      return;
    }
    let newDmMsg:dmModel = new dmModel();
    let chatUser = await this.chatService.checkUserProfileByUserId(clientId);
    if (!chatUser)
      return;
    newDmMsg.userId = chatUser.userId;
    newDmMsg.avatar = chatUser.profile.avatar;
    newDmMsg.username = chatUser.username;
    newDmMsg.msg = privateMsgDto.msg;
    let date = new Date().toString().split(':');
    newDmMsg.date = date[0] + ':' + date[1].split(' ')[0];
    newDmMsg.currentUser = false;
    if (usersClient.get((privateMsgDto.user).toString()) !== undefined)
    {
      usersClient.get((privateMsgDto.user).toString())?.forEach(element => {
        this.server.to(element).emit("receiveNewPrivateMsg", newDmMsg);
        console.log("here");
      });
    }
    newDmMsg.currentUser = true;
    usersClient.get((clientId).toString())?.forEach(element => {
      this.server.to(element).emit("receiveNewPrivateMsg", newDmMsg);
    });
  }


/******************************END DM SUBSCRIBE MESSAGE******************************/






/************************************BLOCK USER**************************************/



@SubscribeMessage('blockUser')
async blockUser(@MessageBody() user:  ConversationDto, @ConnectedSocket() client: Socket) {
  let clientId:any =  getClientId(client, this.jwtService);
  try {
    let test = await this.chatService.blockU(user, clientId);
    if (!test)
      this.server.to(client.id).emit('blockUser', {isBlocked: false});
    else
      this.server.to(client.id).emit('blockUser', {isBlocked: true});
    
  } catch (error) {
    console.error(error);
  }
  return;
}


/**********************************END BLOCK USER************************************/



/************************************KICK USER**************************************/



@SubscribeMessage('Kick')
async kickUser(@MessageBody() kick:  KickDto, @ConnectedSocket() client: Socket) {

  console.log('kick received', kick);
  
  let clientId:any =  getClientId(client, this.jwtService);
  try {
    let test = await this.chatService.kickUser(kick, clientId);
    if (!test)
    {

      let room = roomClients.get(kick.roomId.toString());
      if (room)
      {
        
        for (let index = 0; index < room.length; index++) {
          const element = room[index];
          const clientIds: string[] | undefined = usersClient.get(element);

          if (clientIds)
            this.server.to(clientIds).emit('Kick', {isKicked: false, user: kick.user});
        }
      }
    }
    else
    {
      let room = roomClients.get(kick.roomId.toString());
      if (room) {
        for (let index = 0; index < room.length; index++) {
          const element = room[index];
          const clientIds: string[] | undefined = usersClient.get(element);

          if (clientIds)
            this.server.to(clientIds).emit('Kick', {isKicked: true, user: kick.user});
        }
      }
    }
    
  } catch (error) {
    console.error(error);
  }
  return;
}

/**********************************END KICK USER************************************/




/************************************BAN USER**************************************/



@SubscribeMessage('Ban')
async banUser(@MessageBody() ban:  BanDto, @ConnectedSocket() client: Socket) {

  let clientId:any =  getClientId(client, this.jwtService);
  try {
    let test = await this.chatService.banUser(ban, clientId);
    if (!test)
    {
      let room = roomClients.get(ban.room.toString());
      // this.server.to(roomClients[ban.room.toString()]).emit('Ban', {isBaned: false});

      console.log("!test ",room);
      if (room)
      {
        
        for (let index = 0; index < room.length; index++) {
          const element = room[index];
          const clientIds: string[] | undefined = usersClient.get(element);

          if (clientIds)
            this.server.to(clientIds).emit('Ban', {isBaned: false, user: ban.user});
        }
      }
    }
    else
    {
      let room = roomClients.get(ban.room.toString());

      if (room)
      {
        console.log("test ", room);

        for (let index = 0; index < room.length; index++) {
          const element = room[index];
          const clientIds: string[] | undefined = usersClient.get(element);
          console.log("client", element, clientIds);
          
          if (clientIds)
            this.server.to(clientIds).emit('Ban', {isBaned: true, user: ban.user}); 
        }
      }
    }
    
  } catch (error) {
    console.error(error);
  }
  return;
}

/**********************************END BAN USER************************************/

/************************************MUTE USER**************************************/



@SubscribeMessage('Mute')
async muteUser(@MessageBody() ban:  BanDto, @ConnectedSocket() client: Socket) {
  let clientId:any =  getClientId(client, this.jwtService);
  console.log("hello");
  
  try {
   let test = await this.chatService.muteUser(ban, clientId);
    if (!test)
    {
      let room = roomClients.get(ban.room.toString());
      // this.server.to(roomClients[ban.room.toString()]).emit('Ban', {isBaned: false});

      if (room)
      {
        
        for (let index = 0; index < room.length; index++) {
          const element = room[index];
          const clientIds: string[] | undefined = usersClient.get(element);

          console.log("client", element, clientIds);
          if (clientIds)
            this.server.to(clientIds).emit('Mute', {isBaned: false, user: ban.user});
        }
      }
    }
    else
    {
      let room = roomClients.get(ban.room.toString());

      if (room)
      {
        console.log("test ", room);

        for (let index = 0; index < room.length; index++) {
          const element = room[index];
          const clientIds: string[] | undefined = usersClient.get(element);
          console.log("client", element, clientIds);
          
          if (clientIds)
            this.server.to(clientIds).emit('Mute', {isMuted: true, user: ban.user}); 
        }
      }
    }
    
  } catch (error) {
    console.error(error);
  }
  return;
}

/**********************************END MUTE USER************************************/

@SubscribeMessage('clientId')
async clientUsername(@ConnectedSocket() client: Socket) {
  console.log(`event received: event='clientId' id=${client.id}`);
  let clientId:any =  getClientId(client, this.jwtService);
  const usr: User | null = await this.chatService.checkUser(clientId);
  if (usr)
    this.server.to(client.id).emit('clientId', { user: usr.username });
}


@SubscribeMessage('updateMessages')
async updateMsg(@ConnectedSocket() client: Socket) {

    this.server.to(client.id).emit('updateMessages');
}

/*********************************HANDLE CONNECTION**********************************/

  async handleConnection(@ConnectedSocket() client: Socket)
  { 
    // usersClient.forEach(element => {
    //   console.log(`user connecct ${element}`);
      
    // });


    // console.log(`client connecct ${client.id}`);
    // const result = cookieParser.;
    let clientId:any =  getClientId(client, this.jwtService);
    if (!clientId)
    return;
    try {
      const usr: User | null = await this.chatService.checkUser(clientId);
      if (usr)
        this.server.to(client.id).emit('clientId', { username: usr.username });     
      let checkUserJoined =  await this.chatService.joinToAllUrRooms(clientId);
      checkUserJoined.forEach(element => {
        client.join(element.rid.toString());
      });
      if (clientId !== undefined && usersClient.get((clientId).toString()) === undefined)
        usersClient.set(clientId.toString(), [client.id]);
      else
      {
        let arr: string[] | undefined = new Array();
        arr = usersClient.get((clientId).toString());
        arr?.push(client.id);
        usersClient.set(clientId.toString(), arr);
      }
    } catch (error) { console.log(error); }
  }

  async handleDisconnet(@ConnectedSocket() client: Socket){
    console.log(`client disconnected ${client.id}`);

    let clientId:any =  getClientId(client, this.jwtService);
    if (!clientId)
    return;
    const soct = usersClient.get((clientId).toString());
    if (soct)
      for (let i = 0; i < soct.length; i++) {
        const element = soct[i];
        if (element == client.id)
        {
          soct.splice(i, 1);
          console.log("socket", soct);
          
          usersClient.set((clientId).toString(), soct);
          break;
        }
      }
  }
}
/*********************************HANDLE CONNECTION**********************************/
