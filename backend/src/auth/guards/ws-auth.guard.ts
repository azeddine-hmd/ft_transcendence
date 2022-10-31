import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets/errors';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';

@Injectable()
class WSAuthGuardClass implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient() as Socket;
    const token: string = client.handshake.headers.token as string;
    if (!token) throw new WsException('unautherized');
    const { payload, expired } = this.authService.verifyToken(token);
    if (expired) throw new WsException('refresh');
    client.user = payload;
    return true;
  }
}

export const WSAuthGuard = UseGuards(WSAuthGuardClass);
