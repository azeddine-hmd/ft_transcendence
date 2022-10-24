import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { sleep } from '../utils/delay';
import { AuthService } from './auth.service';
import { UserStates } from './types/user-states';

@Injectable()
export class SocketAuthService {
  usersState = new Map<string, UserStates>();

  constructor(private readonly authService: AuthService) {}

  async monitoringUsersState() {
    while (true) {
      console.log(this.usersState);
      await sleep(1_000);
    }
  }

  async authenticate(client: Socket): Promise<any | null> {
    Logger.log(`Client Socket Connected: id=${client.id}`);
    const token = client.handshake.headers.token as string;
    const payload = this.authService.extractPayload(token);

    try {
      await this.authService.verifyToken(token, payload);
    } catch (err: any) {
      client.emit('error', {
        data: {
          message: 'unautherized',
        },
      });
      client.disconnect();
      return null;
    }

    return payload;
  }

  async addClientWithAuthentication(client: Socket) {
    const payload = await this.authenticate(client);
    if (!payload) return;
    this.addClient(client.id, payload.userId);
    Logger.log(`client ${client.id} connected with userId '${payload.userId}'`);
  }

  addUser(userId: string) {
    this.usersState.set(userId, new UserStates());
  }

  addClient(clientId: string, userId: string) {
    const userStates = this.usersState.get(userId);
    if (!userStates) throw new WsException('user not found!');
    userStates.clients = userStates.clients.add(clientId);
  }

  removeClient(clientId: string) {
    Logger.log(`Client Socket Disconnected: id=${clientId}`);
    const userId = this.getUserId(clientId);
    if (!userId) return;
    const userStates = this.usersState.get(userId);
    if (!userStates) return;
    userStates.clients.delete(clientId);
    if (userStates.clients.size === 0) {
      const userState = this.usersState.get(userId);
      if (userState) {
        userState.online = false;
      }
    }
  }

  getUserId(clientId: string): string | null {
    this.usersState.forEach((userStates: UserStates, userId: string) => {
      if (userStates.clients.has(clientId)) {
        return userId;
      }
    });

    return null;
  }
}
