import {
  Body,
  Controller,
  Get,
  Injectable,
  Logger,
  Post,
  Redirect,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger/dist/decorators';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FTAuthGuard } from './guards/ft.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('authentication')
@Injectable()
@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('/intra')
  @Redirect()
  requestIntraAuth() {
    const fortytwoAuthUrl = new URL(
      this.configService.get('INTRA_AUTH_URL') as string,
    );
    fortytwoAuthUrl.searchParams.set(
      'client_id',
      this.configService.get('CLIENT_ID') as string,
    );
    fortytwoAuthUrl.searchParams.set(
      'redirect_uri',
      this.configService.get('REDIRECT_URI') as string,
    );
    fortytwoAuthUrl.searchParams.set(
      'response_type',
      this.configService.get('RESPONSE_TYPE') as string,
    );

    Logger.debug(fortytwoAuthUrl.toString());

    return {
      url: fortytwoAuthUrl.toString(),
    };
  }

  @LocalAuthGuard
  @Post('/signin')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Get('/logout')
  @Redirect()
  logout() {
    return {
      url: this.configService.get('FRONTEND_HOST') + '/logout',
    };
  }

  @Post('/signup')
  async register(@Body() CreateLoginDto: CreateUserDto) {
    return await this.authService.registerUser(CreateLoginDto);
  }

  @ApiExcludeEndpoint()
  @FTAuthGuard
  @Get('/42/callback')
  @Redirect()
  async FTCallback(@Req() req: any) {
    const loginDto = await this.authService.login(req.user);
    return {
      url:
        this.configService.get('FRONTEND_HOST') +
        `/auth/42/callback?access_token=${loginDto.access_token}`,
    };
  }
}
