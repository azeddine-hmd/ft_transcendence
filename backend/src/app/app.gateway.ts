import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io-client';
import { UserStates } from './types/user-states';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'states',
  cors: [process.env.BACKEND_HOST, process.env.FRONTEND_HOST],
})
@Injectable()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private userStatesList = new Map<string, UserStates>();

  handleConnection(client: Socket, ...args: any[]) {
    Logger.log(`Client Socket Connected: id=${client.id}`);
    const userStates = this.userStatesList.get('azeddine');
    if (!userStates) {
      this.userStatesList.set('azeddine', {
        clients: new Set([client.id]),
        online: true,
        status: '',
      });
    } else {
      userStates.clients = userStates.clients.add(client.id);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    Logger.log(`Client Socket Disconnected: id=${client.id}`);
    const userStates = this.userStatesList.get('azeddine');
    if (!userStates) throw new InternalServerErrorException();
    userStates.clients.delete(client.id);
    if (userStates.clients.size === 0) {
      this.userStatesList.delete('azeddine');
    }
  }

  @SubscribeMessage('UserStates')
  handleUserStates(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): WsResponse<unknown> {
    const event = 'UserStates';
    return {
      event,
      data: { clientId: client.id },
    };
  }
}
