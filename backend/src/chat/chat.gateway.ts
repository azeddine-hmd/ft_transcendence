import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthService } from 'src/auth/socket-auth.service';
import { User } from 'src/users/entities/user.entity';
import { ChatService } from './chat.service';
import { AddRoleToSomeUserDto } from './dto/addRoleToSomeUser.dto';
import { ConversationDto } from './dto/conversation.dto';
import { CreateMsgDto } from './dto/create-msg.dto';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { PrivateMsgDto } from './dto/privateMsg.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';

// let usersClient: Map<string, string[] | undefined> = new Map();
// function getClientId(client: Socket, jwt: JwtService): number {
//   try {
//     let auth: any = '';
//     let tmp;
//     auth = client.handshake.auth.token;
//     const claims = atob(auth.split('.')[1]);
//     tmp = JSON.parse(claims);
//     return tmp.userId;
//   } catch (error) {
//     return 0;
//   }
//   //jwt.verify(auth);
// }

class roomModel {
  id: number;
  title: string;
  description: string;
  members: string;
  privacy: boolean;
  admin: string;
}

class dmModel {
  userId: string;
  username: string;
  msg: string;
  avatar: string;
  currentUser: boolean;
  date: string;
}

class userModel {
  userId: string | undefined;
  username: string | undefined;
  avatar: string | null | undefined;
  displayName: string | undefined;
}

class msgModel {
  userId: string | undefined;
  username: string | undefined;
  avatar: string | null | undefined;
  date: string;
  msg: string;
  currentUser: boolean;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: [process.env.BACKEND_HOST, process.env.FRONTEND_HOST],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly socketAuth: SocketAuthService,
  ) {}

  /***********************PUBLIC AND PROTECTED SUBSCRIBE MESSAGE***********************/

  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() createRoomDto: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.socketAuth.searchForUserId(client.id);
    const test = await this.chatService.createRoom(createRoomDto, userId);
    if (test == null) this.server.emit('createRoom', { created: false });
    else this.server.emit('createRoom', { created: true });
  }

  @SubscribeMessage('updateRoom')
  async updateRoom(
    @MessageBody() updateRoomDto: UpdateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(updateRoomDto);
    const userId = this.socketAuth.searchForUserId(client.id);

    const test = await this.chatService.updateRoom(updateRoomDto, userId);
    if (test == 1)
      this.server.emit('updateRoom', {
        success: false,
        error: 'User not found',
      });
    else if (test == 2)
      this.server.emit('updateRoom', {
        success: false,
        error: 'Room not found',
      });
    else if (test == 3)
      this.server.emit('updateRoom', {
        success: false,
        error: 'This room have another owner',
      });
    else this.server.emit('updateRoom', { success: true, error: '' });
  }

  @SubscribeMessage('addRoleToSomeUser')
  async addRoleToSomeUser(
    @MessageBody() addRoleToSomeUserDto: AddRoleToSomeUserDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(addRoleToSomeUserDto);

    const userId = this.socketAuth.searchForUserId(client.id);

    const test = await this.chatService.addRoleToSomeUser(
      addRoleToSomeUserDto,
      userId,
    );
    console.log(test);

    if (test == 1)
      this.server
        .to(client.id)
        .emit('addRoleToSomeUser', { success: false, error: 'User not found' });
    else if (test == 2) {
      console.log('here');

      this.server.to(client.id).emit('addRoleToSomeUser', {
        success: false,
        error: `${addRoleToSomeUserDto.username} not found`,
      });
    } else if (test == 3)
      this.server
        .to(client.id)
        .emit('addRoleToSomeUser', { success: false, error: 'room not found' });
    else if (test == 4)
      this.server.to(client.id).emit('addRoleToSomeUser', {
        success: false,
        error: 'This room have another owner',
      });
    else if (test == 5)
      this.server.to(client.id).emit('addRoleToSomeUser', {
        success: false,
        error: `${addRoleToSomeUserDto.username} doesn't join this room`,
      });
    else
      this.server
        .to(client.id)
        .emit('addRoleToSomeUser', { success: true, error: '' });
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const messages: msgModel[] = [];

    const userId = this.socketAuth.searchForUserId(client.id);

    const join = await this.chatService.joinRoom(joinRoomDto, userId);
    if (join == 1)
      this.server.to(client.id).emit('joinRoom', {
        role: '',
        room: -1,
        error: 'user not found',
        msgs: null,
      });
    else if (join == 2)
      this.server.to(client.id).emit('joinRoom', {
        role: '',
        room: -1,
        error: 'room not found',
        msgs: null,
      });
    else if (join == 3)
      this.server.to(client.id).emit('joinRoom', {
        role: '',
        room: -1,
        error: 'password incorrect',
        msgs: null,
      });
    else {
      client.join(joinRoomDto.roomId.toString());
      const userRole = await this.chatService.getMemberRole(
        joinRoomDto,
        userId,
      );
      const roomInfo = await this.chatService.getRoomById(joinRoomDto.roomId);

      const msgs = await this.chatService.getAllMsgsPerRoom(joinRoomDto);
      try {
        if (msgs) {
          for (let index = 0; index < msgs.length; index++) {
            const tmp: msgModel = new msgModel();
            const date: string[] = msgs[index].date.toString().split(':');
            const dateMsg: string = date[0] + ':' + date[1].split(' ')[0];
            // tmp.userId = msgs[index].user.userId;
            tmp.msg = msgs[index].msg;
            tmp.date = dateMsg;
            tmp.username = msgs[index].user.username;
            tmp.avatar = msgs[index].user.profile.avatar;
            tmp.currentUser = msgs[index].user.userId == userId;
            messages.push(tmp);
          }
          this.server.to(client.id).emit('joinRoom', {
            role: userRole?.role,
            room: roomInfo,
            error: '',
            msgs: messages,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  @SubscribeMessage('findAllRooms')
  async getRooms(@ConnectedSocket() client: Socket) {
    const userId = this.socketAuth.searchForUserId(client.id);
    try {
      const rooms = await this.chatService.getRooms();
      const arr: any[] = [];
      rooms.forEach((element) => {
        const rm: roomModel = new roomModel();
        rm.id = element.id;
        rm.admin = element.owner.userId;
        rm.title = element.title;
        rm.description = element.description;
        rm.privacy = element.privacy;
        arr.push(rm);
      });
      if (!rooms)
        this.server
          .to(client.id)
          .emit('findAllRooms', { error: 'something went wrong' });
      this.server.to(client.id).emit('findAllRooms', { rooms: arr });
    } catch (error) {
      console.error(error);
    }
    return;
  }

  @SubscribeMessage('createMsg')
  async createMsg(
    @MessageBody() createMsgDto: CreateMsgDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.socketAuth.searchForUserId(client.id);

    const test = await this.chatService.createMsg(createMsgDto, userId);
    if (test == 1)
      this.server
        .to(client.id)
        .emit('createMsg', { created: false, error: 'user not found!' });
    else if (test == 2)
      this.server
        .to(client.id)
        .emit('createMsg', { created: false, error: 'room not found!' });
    else if (test == 3)
      this.server.to(client.id).emit('createMsg', {
        created: false,
        error: "u didn't join this room!",
      });
    else {
      client.join(createMsgDto.room.toString());
      const userInfo: User | null =
        await this.chatService.checkUserProfileByUserId(userId);
      try {
        if (!userInfo) return;
        const tmp: msgModel = new msgModel();
        const date = createMsgDto.date.toString().split(':');
        const dateMsg = date[0] + ':' + date[1].split(' ')[0];
        tmp.userId = userInfo.userId;
        tmp.date = dateMsg;
        tmp.msg = createMsgDto.msg;
        tmp.username = userInfo.username;

        tmp.avatar = userInfo.profile.avatar;
        tmp.currentUser = false;

        client.broadcast
          .to(createMsgDto.room.toString())
          .emit('createMsg', { created: true, room: createMsgDto.room, tmp });
        tmp.currentUser = true;
        this.server
          .to(client.id)
          .emit('createMsg', { created: true, room: createMsgDto.room, tmp });
      } catch (e) {}
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
  async conversation(@ConnectedSocket() client: Socket) {
    const userId = this.socketAuth.searchForUserId(client.id);

    /*
      get from the conversation table in the database
      all the users that the current user talk with them
    */
    const test = await this.chatService.conversation(userId);
    const arr: any[] = [];

    if (test.length > 0) {
      test.forEach((element) => {
        const userConversation: userModel = new userModel();
        if (element.user1.userId == userId) {
          userConversation.avatar = element.user2.profile.avatar;
          userConversation.displayName = element.user2.profile.displayName;
          userConversation.userId = element.user2.userId;
          userConversation.username = element.user2.username;
          arr.push(userConversation);
        } else {
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
  async getPrivateMsg(
    @MessageBody() conversationDto: ConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.socketAuth.searchForUserId(client.id);

    const test = await this.chatService.getPrivateMsg(conversationDto, userId);
    if (!test) {
      this.server
        .to(client.id)
        .emit('getPrivateMsg', { success: false, error: 'user not found' });
      return;
    }
    const arr: any[] = [];
    test.forEach((element) => {
      const dm: dmModel = new dmModel();
      dm.userId = element.sender.userId;
      dm.username = element.sender.username;
      dm.msg = element.message;
      dm.avatar = element.sender.profile.avatar;
      const date = element.date.toString().split(':');
      dm.date = date[0] + ':' + date[1].split(' ')[0];
      dm.currentUser = element.sender.userId == userId ? true : false;
      arr.push(dm);
    });
    const u = await this.chatService.checkUserByUserName(conversationDto.user);

    this.server.to(client.id).emit('getPrivateMsg', {
      success: true,
      error: '',
      privateMessages: arr,
      username: u?.username,
      userId: u?.userId,
    });
  }

  /*
    add new private message related to some user to DM table in the database
  */
  @SubscribeMessage('createnNewPrivateMsg')
  async createMsgPrivate(
    @MessageBody() privateMsgDto: PrivateMsgDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.socketAuth.searchForUserId(client.id);
    if (!(await this.chatService.createMsgPrivate(privateMsgDto, userId))) {
      this.server.to(client.id).emit('receiveNewPrivateMsg', {
        error: 'Something went wrong: the message is not inserted',
      });
      return;
    }
    const newDmMsg: dmModel = new dmModel();
    const chatUser = await this.chatService.checkUserProfileByUserId(userId);
    console.log(chatUser);
    if (!chatUser) return;
    newDmMsg.userId = chatUser.userId;
    newDmMsg.avatar = chatUser.profile.avatar;
    newDmMsg.username = chatUser.username;
    newDmMsg.msg = privateMsgDto.msg;
    const date = new Date().toString().split(':');
    newDmMsg.date = date[0] + ':' + date[1].split(' ')[0];
    newDmMsg.currentUser = false;
    //TODO: what should be replaced with usersClient ?
    // if (usersClient.get(privateMsgDto.user.toString()) !== undefined) {
    //   usersClient.get(privateMsgDto.user.toString())?.forEach((element) => {
    //     this.server.to(element).emit('receiveNewPrivateMsg', newDmMsg);
    //     console.log('here');
    //   });
    // }
    newDmMsg.currentUser = true;
    //TODO: what should be replaced with usersClient ?
    // usersClient.get(userId)?.forEach((element) => {
    //   this.server.to(element).emit('receiveNewPrivateMsg', newDmMsg);
    // });
  }

  /******************************END DM SUBSCRIBE MESSAGE******************************/

  /*********************************HANDLE CONNECTION**********************************/

  async handleConnection(@ConnectedSocket() client: Socket) {
    await this.socketAuth.authenticate(client);
    // let clientId: any = getClientId(client, this.jwtService);
    // if (!clientId) return;
    // try {
    //   this.server.to(client.id).emit('clientId', { userId: clientId });
    //   let checkUserJoined = await this.chatService.joinToAllUrRooms(clientId);
    //   checkUserJoined.forEach((element) => {
    //     client.join(element.rid.toString());
    //   });
    //   if (
    //     clientId !== undefined &&
    //     usersClient.get(clientId.toString()) === undefined
    //   )
    //     usersClient.set(clientId.toString(), [client.id]);
    //   else {
    //     let arr: string[] | undefined = new Array();
    //     arr = usersClient.get(clientId.toString());
    //     arr?.push(client.id);
    //     usersClient.set(clientId.toString(), arr);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.socketAuth.removeClient(client.id);
  }
}

/*********************************HANDLE CONNECTION**********************************/
