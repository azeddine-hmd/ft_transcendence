import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from '../auth.service';
import { FtProfileDto } from '../dto/payload/ft-profile.dto';
import { JwtPayload } from '../types/jwt-payload.dto';

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
    profile: any,
  ): Promise<JwtPayload> {
    Logger.debug(`FtStrategy#validate: validating...`);
    const ftProfileDto = profile as FtProfileDto;
    Logger.debug(
      `FtStrategy#validate: processing profile of '${ftProfileDto.username}'`,
    );
    const user = await this.usersSerivce.findOrCreate(ftProfileDto);
    return { username: user.username, userId: user.userId };
  }
}
