import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { UserJwtPayload } from '../../auth/types/user-jwt-payload';
import { FriendsStates } from '../dto/types/friends-states';
import { RelationsService } from './relations.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersSocketService {
  usersClients = new Map<string, string[]>();

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly relationsService: RelationsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async authenticate(client: Socket): Promise<UserJwtPayload> {
    const rawCookies = client.handshake.headers.cookie;
    if (!rawCookies) throw new WsException('unautherized');
    const token = parse(rawCookies).access_token;
    if (!token) throw new WsException('unautherized');
    const { jwtPayload, expired } = this.authService.verifyJwtToken(token);
    if (expired) throw new WsException('refresh');
    client.user = jwtPayload;
    return jwtPayload;
  }

  async addClient(clientId: string, userId: string) {
    const clients = this.usersClients.get(userId);
    if (!clients) this.usersClients.set(userId, [clientId]);
    Logger.log(`user userId=${userId} goes online!`);
    await this.usersService.setOnline(userId, true);
  }

  async removeClient(userId: string, clientId: string) {
    const clients = this.usersClients.get(userId);
    if (!clients)
      throw new InternalServerErrorException(
        `illegal state: user clients list doens't exist`,
      );

    console.log(`client before: ${JSON.stringify(clients)}`);
    const clientIndex = clients.indexOf(clientId);
    clients.splice(clientIndex, 1);
    console.log(`client after: ${JSON.stringify(clients)}`);

    if (clients.length === 0) {
      Logger.log(`user userId=${userId} goes offline!`);
      await this.usersService.setOnline(userId, false);
    }
  }

  async setStates(userId: string, status: string) {
    await this.usersService.setStatus(userId, status);
  }

  async getFriendsStates(userId: string): Promise<FriendsStates[]> {
    const friends = await this.relationsService.getAllFriendsRelations(userId);

    return friends.map((pair) => {
      const { second: profile } = pair;

      return {
        username: profile.user.username,
        displayName: profile.displayName,
        online: profile.user.online,
        status: profile.user.status,
      };
    });
  }
}
