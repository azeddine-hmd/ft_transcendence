import { UserJwtPayload } from 'src/auth/types/user-jwt-payload';

export declare global {
  namespace Express {
    /* eslint-disable @typescript-eslint/no-empty-interface */
    interface User extends UserJwtPayload {}
  }
}
