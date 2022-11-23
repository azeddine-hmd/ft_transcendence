import { UserJwtPayload } from 'src/auth/types/user-jwt-payload';

export declare module 'socket.io' {
  interface Socket {
    user: UserJwtPayload;
  }
}
