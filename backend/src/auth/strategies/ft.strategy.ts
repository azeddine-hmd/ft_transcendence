import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from '../auth.service';
import { FtProfile } from '../types/ft-profile';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private usersSerivce: UsersService,
  ) {
    super({
      clientID: configService.get('CLIENT_ID'),
      clientSecret: configService.get('SECRET'),
      callbackURL: configService.get('BACKEND_HOST') + '/api/auth/42/callback',
      scope: 'public',
      profileFields: {
        ftId: (obj: any) => String(obj.id),
        username: 'login',
        avatar: 'image_url',
        displayName: 'displayname',
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: FtProfile,
  ): Promise<Express.User> {
    const user = await this.usersSerivce.findOrCreate(profile);
    return { username: user.username, userId: user.userId };
  }
}
