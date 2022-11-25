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
import { UserStates } from '../../auth/types/user-states';
import { FriendsStates } from '../dto/types/friends-states';
import { RelationsService } from './relations.service';
import { profileToProfileResponse } from 'src/profiles/utils/entity-payload-converter';

@Injectable()
export class UsersSocketService {
  usersState = new Map<string, UserStates>();

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly relationsService: RelationsService,
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
    console.log(clientId);
    userStates.clients.add(clientId);
    console.log(clientId);
    userStates.online = true;
  }

  removeClient(userId: string, clientId: string) {
    const userStates = this.usersState.get(userId);
    if (!userStates)
      throw new InternalServerErrorException(`user state doesn't exist`);
    userStates.clients.delete(clientId);
    console.log(userStates.clients.size);
    if (userStates.clients.size === 0) {
      userStates.online = false;
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

  async getFriendsStates(userId: string): Promise<FriendsStates[]> {
    const friends = await this.relationsService.getAllFriendsRelations(userId);
    return friends.map((pair) => {
      const { second: profile } = pair;
      const userState = this.usersState.get(userId);
      if (!userState) throw new WsException('user states not found');
      return {
        profile: profileToProfileResponse(profile),
        states: {
          online: userState.online,
          status: userState.status,
        },
      };
    });
  }
}
