import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersSocketService } from './users-socket.service';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'states',
  cors: [process.env.BACKEND_HOST, process.env.FRONTEND_HOST],
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly usersSocketService: UsersSocketService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    await this.usersSocketService.addClientWithAuthentication(client);
  }

  async handleDisconnect(client: Socket) {
    this.usersSocketService.removeClient(client.id);
  }
}
