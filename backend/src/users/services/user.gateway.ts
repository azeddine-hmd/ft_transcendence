import { UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WSAuthGuard } from '../../auth/guards/ws-auth.guard';
import { WsExceptionFilter } from '../../filter/ws-filter';
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

  async handleConnection(client: Socket, ...args: any[]) {
    const payload = await this.usersSocketService.authenticate(client);
    this.usersSocketService.addClient(client.id, payload.userId);
  }

  async handleDisconnect(client: Socket) {
    this.usersSocketService.removeClient(client.id);
  }

  @SubscribeMessage('userState')
  userState(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any,
  ): WsResponse<unknown> {
    const event = 'userState';
    console.log(
      `username: ${client.user.username} and userId: ${client.user.username}`,
    );
    return {
      event,
      data: {
        message: 'server respond message',
      },
    };
  }
}
