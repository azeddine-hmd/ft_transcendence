import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UserStates } from './types/user-states';

@Injectable()
export class SocketAuthService {
  userStatesList = new Map<string, UserStates>();

  constructor(private readonly authService: AuthService) {}

  async authenticate(client: Socket) {
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
    }

    this.addClient(client.id, payload.userId);
    Logger.log(`client ${client.id} connected with userId '${payload.userId}'`);
  }

  addClient(clientId: string, userId: string) {
    const userStates = this.userStatesList.get(userId);
    if (!userStates) {
      this.userStatesList.set(userId, {
        clients: new Set([clientId]),
        online: true,
        status: '',
      });
    } else {
      userStates.clients = userStates.clients.add(clientId);
    }
  }

  removeClient(clientId: string) {
    Logger.log(`Client Socket Disconnected: id=${clientId}`);
    const userId = this.searchForUserId(clientId);
    if (!userId) return;
    const userStates = this.userStatesList.get(userId);
    if (!userStates) return;
    userStates.clients.delete(clientId);
    if (userStates.clients.size === 0) {
      this.userStatesList.delete(userId);
    }
  }

  searchForUserId(clientId: string): string | null {
    this.userStatesList.forEach((userStates: UserStates, userId: string) => {
      if (userStates.clients.has(clientId)) {
        return userId;
      }
    });

    return null;
  }
}
