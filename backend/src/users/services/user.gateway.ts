import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketAuthService } from '../auth/socket-auth.service';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'states',
  cors: [process.env.BACKEND_HOST, process.env.FRONTEND_HOST],
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly socketAuth: SocketAuthService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    await this.socketAuth.addClientWithAuthentication(client);
  }

  async handleDisconnect(client: Socket) {
    this.socketAuth.removeClient(client.id);
  }
}
