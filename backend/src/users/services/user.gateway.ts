import { UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WSAuthGuard } from '../../auth/guards/ws-auth.guard';
import { handleWsException, WsExceptionFilter } from '../../filter/ws-filter';
import { UsersSocketService } from './users-socket.service';

@WSAuthGuard
@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'states',
  cors: [process.env.BACKEND_HOST, process.env.FRONTEND_HOST],
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly usersSocketService: UsersSocketService) {}

  async handleConnection(client: Socket, ..._args: any[]) {
    try {
      const payload = await this.usersSocketService.authenticate(client);
      this.usersSocketService.addClient(client.id, payload.userId);
    } catch (exception) {
      handleWsException(client, exception);
    }
  }

  handleDisconnect(client: Socket) {
    this.usersSocketService.removeClient(client.id);
  }
}
