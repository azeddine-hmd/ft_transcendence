import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { arrayBuffer } from 'stream/consumers';
import { atob } from 'buffer';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

function getClientId(client: Socket, jwt: JwtService): number
{
  let auth:any =  client.handshake.auth.token;
  jwt.verify(auth);
  const claims = atob(auth.split('.')[1]);
  let tmp = JSON.parse(claims);
  return (tmp.userId);
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: GameService, private readonly jwtService: JwtService) {}



  async handleConnection(@ConnectedSocket() client: Socket)
  { 
    console.log("user", client.id);
    let clientId:any =  getClientId(client, this.jwtService);
    if (!clientId)
    return;
    
    this.server.to(client.id).emit('clientId', { userId: clientId });
  }



}
