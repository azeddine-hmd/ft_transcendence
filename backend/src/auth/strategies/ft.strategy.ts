import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { EnvService } from 'src/conf/env.service';
import { UsersService } from '../../users/services/users.service';
import { FtProfile } from '../types/ft-profile';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly envService: EnvService,
    private readonly usersSerivce: UsersService,
  ) {
    super({
      clientID: envService.get('CLIENT_ID'),
      clientSecret: envService.get('SECRET'),
      callbackURL: envService.get('BACKEND_HOST') + '/api/auth/42/callback',
      scope: 'public',
      profileFields: {
        ftId: (obj: any) => String(obj.id),
        username: 'login',
        avatar: 'image.link',
        displayName: 'displayname',
      },
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    ftProfile: FtProfile,
  ): Promise<Express.User> {
    if (!ftProfile.avatar) {
      ftProfile.avatar = this.envService.get('DEFAULT_AVATAR');
    }
    if (!ftProfile.displayName) {
      throw new BadRequestException(
        `could'nt fetch display name from 42 intra`,
      );
    }
    const user = await this.usersSerivce.findOrCreate(ftProfile);
    return { username: user.username, userId: user.userId };
  }
}
