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
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/payload/create-user.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { FTAuthGuard } from './guards/ft.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('authentication')
@Injectable()
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  //TODO: refactor
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
      (this.configService.get('BACKEND_HOST') as string) +
        (this.configService.get('REDIRECT_URI') as string),
    );
    fortytwoAuthUrl.searchParams.set(
      'response_type',
      this.configService.get('RESPONSE_TYPE') as string,
    );

    return {
      url: fortytwoAuthUrl.toString(),
    };
  }

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'signin user with credentials',
    type: LoginResponseDto,
  })
  @LocalAuthGuard
  @Post('/signin')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @JwtAuthGuard
  @Get('/logout')
  async logout(@Req() req: any) {
    Logger.debug(
      `AuthController#logout: user ${req.user.username} logging-out!`,
    );
    const user = await this.usersService.updateUser(req.user.userId, {
      token: null,
    });
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
