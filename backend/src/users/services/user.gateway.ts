import { forwardRef, Inject, Logger, UseFilters } from '@nestjs/common';
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
import { handleWsException, WsExceptionFilter } from '../../filter/ws-filter';
import { UsersSocketService } from './users-socket.service';

@WSAuthGuard
@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'states',
  cors: [process.env.FRONTEND_DOMAIN],
  cookie: true,
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => UsersSocketService))
    private readonly usersSocketService: UsersSocketService,
  ) {}

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async handleConnection(client: Socket, ..._args: any[]) {
    try {
      await this.usersSocketService.authenticate(client);
      await this.usersSocketService.addClient(client.id, client.user.userId);
      Logger.log(`client socket connected on user gateway: id=${client.id}`);
    } catch (exception) {
      handleWsException(client, exception);
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.user) {
      Logger.log(`client socket disconnected on user gateway: id=${client.id}`);
      try {
        await this.usersSocketService.removeClient(client.user.userId, client.id);
      } catch (exception) {
        
      }
    }
  }

  @SubscribeMessage('FriendsStates')
  async friendsStates(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): Promise<WsResponse<unknown>> {
    const states = await this.usersSocketService.getFriendsStates(
      client.user.userId,
    );
    return {
      event: 'FriendsStates',
      data: states,
    };
  }
}
