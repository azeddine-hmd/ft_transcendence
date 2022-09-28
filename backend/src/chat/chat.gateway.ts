import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';
import { JoinRoomDto } from './dto/join-room.dto';
import { CreateMsgDto } from './dto/create-msg.dto';
import { ConversationDto } from './dto/conversation.dto';
import { PrivateMsgDto } from './dto/privateMsg.dto';
import { arrayBuffer } from 'stream/consumers';
import { atob } from 'buffer';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'src/profiles/entities/profile.entity';
import { use } from 'passport';

let usersClient:Map<string, string[] | undefined> = new Map();
function getClientId(client: Socket, jwt: JwtService): number
{
  try {
    let auth:any = "";
    let tmp;
    auth =  client.handshake.auth.token;
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

class dmModel {
  userid: string;
  username: string;
  msg: string;
  avatar: string;
  currentUser: boolean;
  date: Date;
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

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService, private readonly jwtService: JwtService) {}

/***********************PUBLIC AND PROTECTED SUBSCRIBE MESSAGE***********************/


  @SubscribeMessage('createRoom')
  async  createRoom(@MessageBody() createRoomDto: CreateRoomDto, @ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client, this.jwtService);
    let test =  await this.chatService.createRoom(createRoomDto, clientId);
    if(test == null)
      this.server.emit('createRoom', { created: false });
    else
      this.server.emit('createRoom', {  created: true });
  }

  @SubscribeMessage('joinRoom')
  async  joinRoom(@MessageBody() joinRoomDto: JoinRoomDto, @ConnectedSocket() client: Socket)
  {
    let messages:msgModel[] = [];
    let clientId:any =  getClientId(client, this.jwtService);
    let join =  await this.chatService.joinRoom(joinRoomDto, clientId);
    if (join == 1)
      this.server.to(client.id).emit('joinRoom', { roomId: -1, error: "user not found" });
    else if (join == 2)
      this.server.to(client.id).emit('joinRoom', { roomId: -1, error: "room not found" });
    else if (join == 3)
      this.server.to(client.id).emit('joinRoom', { roomId: -1, error: "password incorrect" });
    else
    {
      client.join(joinRoomDto.roomId.toString());
      const roomInfo = await this.chatService.getRoomById(joinRoomDto);
      const msgs = await this.chatService.getAllMsgsPerRoom(joinRoomDto);
      try{    
        if (msgs)
        {
          for (let index = 0; index < msgs.length; index++) {
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
          this.server.to(client.id).emit('joinRoom', { room: roomInfo, msgs: messages });
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
    else
    {
      client.join(createMsgDto.room.toString());
      const userInfo:User | null = await this.chatService.checkUserProfile(clientId);
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
        
        client.broadcast.to(createMsgDto.room.toString()).emit('createMsg', { created: true, room: createMsgDto.room, tmp });
        tmp.currentUser = true;
        this.server.to(client.id).emit('createMsg', { created: true, room: createMsgDto.room, tmp });
      }
      catch(e){}
    }
  }


/*********************END PUBLIC AND PROTECTED SUBSCRIBE MESSAGE*********************/



/********************************DM SUBSCRIBE MESSAGE********************************/

  /* 
    when the you user chat with other user, add I add them to the table 
    conversation table, in this subscribe message i emit all the users that
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
    let arr = new Array();

    if (test.length > 0)
    {
      test.forEach(element => {
        let userConversation:userModel = new userModel();        
        if (element.user1.id == clientId)
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
    let arr = new Array();
    test.forEach(element => {
      let dm: dmModel = new dmModel();
      if (element.sender.id == clientId)
      {
        dm.userid = element.sender.userId;
        dm.username = element.sender.profile.displayName;
        dm.msg = element.message;
        dm.avatar = element.sender.profile.avatar;
        dm.currentUser = true;
        dm.date = element.date;
        arr.push(dm);
      }
      else
      {
        dm.userid = element.receiver.userId;
        dm.username = element.receiver.profile.displayName;
        dm.msg = element.message;
        dm.avatar = element.receiver.profile.avatar;
        dm.currentUser = false;
        dm.date = element.date;
        arr.push(dm);
      }
    });
    this.server.to(client.id).emit('getPrivateMsg', arr);
  }

  /*
    add new private message related to some user to DM table in the database
  */
  @SubscribeMessage('createMsgPrivate')
  async  createMsgPrivate(@MessageBody() privateMsgDto:  PrivateMsgDto, @ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client, this.jwtService);
    await this.chatService.createMsgPrivate(privateMsgDto, clientId);
    if (usersClient.get((privateMsgDto.user).toString()) !== undefined)
    {
      let u = await this.chatService.checkUser(clientId);
      let newDmMsg:dmModel = new dmModel();
      // newDmMsg.userid = privateMsgDto.userId;
      // newDmMsg.username = element.sender.profile.displayName;
      // newDmMsg.msg = element.message;
      // newDmMsg.avatar = element.sender.profile.avatar;
      // newDmMsg.currentUser = true;
      // newDmMsg.date = element.date;
      // arr.push(newDmMsg);
      usersClient.get((privateMsgDto.user).toString())?.forEach(element => {
        this.server.to(element).emit("receiveNewPrivateMsg", {sender: u, msg: privateMsgDto.msg});
      });
      this.server.to(client.id).emit("receiveNewPrivateMsg", {sender: u, msg: privateMsgDto.msg});
    }
  }


/******************************END DM SUBSCRIBE MESSAGE******************************/









/*********************************HANDLE CONNECTION**********************************/


  async handleConnection(@ConnectedSocket() client: Socket)
  { 
    let clientId:any =  getClientId(client, this.jwtService);
    if (!clientId)
    return;
    try {
      this.server.to(client.id).emit('clientId', { userId: clientId });     
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
}


/*********************************HANDLE CONNECTION**********************************/
