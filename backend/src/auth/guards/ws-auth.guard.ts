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
    const tokenVal = client.handshake.headers.token;
    const token = Array.isArray(tokenVal) ? (tokenVal[0] as string) : tokenVal;
    if (!token) throw new WsException('unautherized');
    const { jwtPayload, expired } = this.authService.verifyJwtToken(token);
    if (expired) throw new WsException('refresh');
    client.user = jwtPayload;
    return true;
  }
}

export const WSAuthGuard = UseGuards(WSAuthGuardClass);
