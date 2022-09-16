import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { JoinRoomDto } from './dto/join-room.dto';
import { CreateMsgDto } from './dto/create-msg.dto';
import { ConversationDto } from './dto/conversation.dto';
import { PrivateMsgDto } from './dto/privateMsg.dto';
import { arrayBuffer } from 'stream/consumers';
import { atob } from 'buffer';
import { User } from 'src/users/entities/user.entity';


let usersClient:Map<string, string[] | undefined> = new Map();
function getClientId(client: Socket): number
{
  let auth:any =  client.handshake.auth.token;
  const claims = atob(auth.split('.')[1]);
  let tmp = JSON.parse(claims);
  return (tmp.userId);
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createRoom')
  async  createRoom(@MessageBody() createRoomDto: CreateRoomDto, @ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client);
    let test =  await this.chatService.createRoom(createRoomDto, clientId);
    if(test == null)
      this.server.emit('createRoom', { created: false });
    else
      this.server.emit('createRoom', {  created: true });

      // { "title": "topic#", "description": "desc topic#", "privacy": true, "password": "pass123", "owner": { "id": +createNewRoom.value, "name": null } }
  }

  
  @SubscribeMessage('joinRoom')
  async  joinRoom(@MessageBody() joinRoomDto: JoinRoomDto, @ConnectedSocket() client: Socket) {
    console.log(joinRoomDto);
    
    let clientId:any =  getClientId(client);
    let join =  await this.chatService.joinRoom(joinRoomDto, clientId);
    if (join == 1)
      this.server.to(client.id).emit('joinRoom', { roomId: -1, error: "user not found" });
    else if (join == 2)
      this.server.to(client.id).emit('joinRoom', { roomId: -1, error: "room not found" });
    else
    {

      client.join(joinRoomDto.roomId.toString());
      // this.server.to(joinRoomDto.roomId.toString()).emit("message", {msg: "right"})

      const roomInfo = await this.chatService.getRoomById(joinRoomDto);
      const msgs = await this.chatService.getAllMsgsPerRoom(joinRoomDto);
      console.log(msgs);
      
      this.server.to(client.id).emit('joinRoom', { room: roomInfo, msgs: msgs });

      // { "uid":2, "rid":1, "userId": 2, "roomId": 1 }
    }
    
  }

  @SubscribeMessage('findAllRooms')
  async getRooms(@ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client);
    const rooms = await this.chatService.getRooms();
    this.server.to(client.id).emit('findAllRooms', { rooms });
  }
  


  @SubscribeMessage('createMsg')
  async  createMsg(@MessageBody() createMsgDto: CreateMsgDto, @ConnectedSocket() client: Socket) {
    
    let clientId:any =  getClientId(client);
    

    let test =  await this.chatService.createMsg(createMsgDto, clientId);
    if(test == 1)
      this.server.to(client.id).emit('createMsg', { created: false, error: "user not found!" });
    else if (test == 2)
      this.server.to(client.id).emit('createMsg', { created: false, error: "room not found!" });
    else if (test == 3)
      this.server.to(client.id).emit('createMsg', { created: false, error: "u didn't join this room!" });
    else
    {
      // this.server.emit('createMsg', { created: true, error: "" });
      // client.broadcast('', {});

      client.join(createMsgDto.room.toString());
      const userInfo = await this.chatService.getUserById(clientId);
      this.server.to(createMsgDto.room.toString()).emit('createMsg', { created: true, user: userInfo, room: createMsgDto.room, newmsg: createMsgDto.msg });
    }

  
      // { "user": 1, "room": 1, "msg": "hello" }
  }







  @SubscribeMessage('conversation')
  async  conversation(@ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client);
    let test =  await this.chatService.conversation(clientId);

    let arr: User[] = [];
    
    if (test.length > 0)
    {
      test.forEach(element => {
        
        if (element.user1.id == clientId)
        arr.push(element.user2);
        else
        arr.push(element.user1);
      });
    }
    this.server.to(client.id).emit('conversation', arr);


    // client.broadcast('', {});
    // client.join(createMsgDto.room.toString());

    // this.server.to(createMsgDto.room.toString()).emit('createMsg', { created: true, newnsg: createMsgDto.msg });



    // { "user": 1, "room": 1, "msg": "hello" }
  }

  

  @SubscribeMessage('getPrivateMsg')
  async  getPrivateMsg(@MessageBody() conversationDto: ConversationDto, @ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client);
   
    
    let test =  await this.chatService.getPrivateMsg(conversationDto, clientId);

    let arr: Users[] = [];
    
    // if (test > 0)
    // {
      // test.forEach(element => {
        
        // if (element.user1.id == auth)
        // arr.push(element.user2);
        // else
        // arr.push(element.user1);
      // });
    // }
    
    this.server.to(client.id).emit('getPrivateMsg', test);


    // client.broadcast('', {});
    // client.join(createMsgDto.room.toString());

    // this.server.to(createMsgDto.room.toString()).emit('createMsg', { created: true, newnsg: createMsgDto.msg });



    // { "user": 1, "room": 1, "msg": "hello" }
  }


  @SubscribeMessage('createMsgPrivate')
  async  createMsgPrivate(@MessageBody() privateMsgDto:  PrivateMsgDto, @ConnectedSocket() client: Socket) {
    let clientId:any =  getClientId(client);
    await this.chatService.createMsgPrivate(privateMsgDto, clientId);

    if (usersClient.get((privateMsgDto.user).toString()) !== undefined)
    {
      let u = await this.chatService.getUser(clientId);

      usersClient.get((privateMsgDto.user).toString())?.forEach(element => {
        
        this.server.to(element).emit("receiveNewPrivateMsg", {sender: u, msg: privateMsgDto.msg});
      });
    
    }
    // client.broadcast.emit("createMsgPrivate", { newMsg: privateMsgDto.msg })

  }

  // last practice

  async handleConnection(@ConnectedSocket() client: Socket)
  { 
    let clientId:any =  getClientId(client);
    if (!clientId)
    return;
    // clientId = claims
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

    
    // number = parseInt(number);
    // if(number > 3)
    // {
    //   socket.join("right")
    // }
    // else{
    //   socket.join("left");
    // }
    // this.server.emit("greeting", {msg: "hello form faical server"});



    // const rooms = await this.chatService.getRooms();
    // this.server.to(socket.id).emit('findAllRooms', { rooms });
  }

  // @SubscribeMessage('message')
  // remove(@MessageBody() message: string) {
  //   console.log("message is recieved :" + message )
  //   this.server.to("right").emit("message", {msg: "right"})
  // }

}
