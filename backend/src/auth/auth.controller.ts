import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
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
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { UsersService } from '../users/services/users.service';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/payload/signin-user.dto';
import { SignupUserDto } from './dto/payload/signup-user.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { FTAuthGuard } from './guards/ft.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { getIntraAuthUrl } from './utils/url-constructor';

@ApiTags('authentication')
@Injectable()
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiResponse({ description: 'redirect to 42 authorization page' })
  @Get('/intra')
  @Redirect()
  intraAuth() {
    return { url: getIntraAuthUrl(this.configService) };
  }

  @ApiResponse({ description: 'logout user and invalidate current token' })
  @ApiBearerAuth()
  @JwtAuthGuard
  @Get('/logout')
  async logout(@Req() req: any) {
    Logger.debug(
      `AuthController#logout: user ${req.user.username} logging-out!`,
    );
    await this.usersService.updateUser(req.user.userId, {
      token: null,
    });
  }

  @ApiResponseProperty({ type: SignupUserDto })
  @ApiResponse({
    description: 'register user',
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signup(@Body() signupUserDto: SignupUserDto) {
    await this.authService.registerUser(signupUserDto);
  }

  @ApiBody({ type: SigninUserDto })
  @ApiResponse({
    status: 200,
    description: 'signin user with username and password',
    type: LoginResponseDto,
  })
  @LocalAuthGuard
  @Post('/signin')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @ApiExcludeEndpoint()
  @FTAuthGuard
  @Get('/42/callback')
  @Redirect()
  async FTCallback(@Req() req: any) {
    const loginDto = await this.authService.login(req.user);
    const frontendHost = this.configService.get('FRONTEND_HOST');
    if (!frontendHost) {
      throw new InternalServerErrorException();
    }

    return {
      url: `${frontendHost}/auth/42/callback?access_token=${loginDto.access_token}`,
    };
  }
}
