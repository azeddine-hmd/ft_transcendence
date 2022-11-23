export class UserJwtPayload {
  username: string;
  userId: string;
  tfa?: 'pending' | 'accepted';
}
