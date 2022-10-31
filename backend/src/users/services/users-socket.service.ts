import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { UserStates } from '../../auth/types/user-states';

@Injectable()
export class UsersSocketService {
  usersState = new Map<string, UserStates>();

  constructor(private readonly authService: AuthService) {}

  async authenticate(client: Socket): Promise<any> {
    Logger.log(`Client Socket Connected: id=${client.id}`);
    const token = client.handshake.headers.token;
    if (!token) throw new WsException('unautherized');
    const { payload, expired } = this.authService.verifyToken(token as string);
    if (expired) throw new WsException('refresh');
    client.user = payload;
    return payload;
  }

  addUser(userId: string) {
    this.usersState.set(userId, new UserStates());
    Logger.log(`User(userId=${userId}) added to UserStatus List`);
  }

  removeUser(userId: string) {
    this.usersState.delete(userId);
    Logger.log(`User(userId=${userId}) removed from UserStatus List`);
  }

  addClient(clientId: string, userId: string) {
    let userStates = this.usersState.get(userId);

    //DEBUG
    if (!userStates) {
      this.usersState.set(userId, new UserStates());
      userStates = this.usersState.get(userId);
    }

    if (!userStates) throw new WsException('user not found!');
    userStates.clients = userStates.clients.add(clientId);
    userStates.online = true;
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

  setStates(userId: string, status: string) {
    const userStates = this.usersState.get(userId);
    if (!userStates) return;
    userStates.status = status;
  }
}
