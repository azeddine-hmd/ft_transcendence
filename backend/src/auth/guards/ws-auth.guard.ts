import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets/errors';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { UsersSocketService } from 'src/users/services/users-socket.service';

@Injectable()
class WSAuthGuardClass implements CanActivate {
  constructor(private readonly usersSocketService: UsersSocketService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient() as Socket;
    return this.usersSocketService
      .authenticate(client)
      .then((_) => {
        return true;
      })
      .catch((reason) => {
        console.log(reason);
        throw new WsException(reason);
      });
  }
}

export const WSAuthGuard = UseGuards(WSAuthGuardClass);
