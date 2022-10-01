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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { UsersService } from '../users/services/users.service';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/payload/signin-user.dto';
import { SignupUserDto } from './dto/payload/signup-user.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { FTAuthGuard } from './guards/ft.guard';
import { JwtAuth } from './guards/jwt-auth.guard';
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

  @ApiResponse({ status: 302 })
  @ApiOperation({ summary: 'Redirect to 42 authorization page' })
  @Get('/intra')
  @Redirect()
  intraAuth() {
    return { url: getIntraAuthUrl(this.configService) };
  }

  @ApiOperation({
    summary: 'Logout current user and invalidate session access token',
  })
  @ApiBearerAuth()
  @JwtAuth
  @Get('/logout')
  async logout(@Req() req: any) {
    Logger.debug(
      `AuthController#logout: user ${req.user.username} logging-out!`,
    );
    await this.usersService.updateUser(req.user.userId, {
      token: null,
    });
  }

  @ApiResponse({ type: LoginResponseDto })
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: SignupUserDto })
  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signup(@Body() signupUserDto: SignupUserDto) {
    await this.authService.registerUser(signupUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'signin user with username and password',
    type: LoginResponseDto,
  })
  @ApiOperation({ summary: 'Signin user with username/password' })
  @ApiBody({ type: SigninUserDto })
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

  @ApiResponse({ status: 200, description: 'verify current user credentials' })
  @ApiOperation({ summary: 'Verify current user session access token' })
  @ApiBearerAuth()
  @JwtAuth
  @HttpCode(HttpStatus.OK)
  @Get('/verify')
  async verify(@Req() req: any) {
    Logger.log(`user ${req.user.username} verified`);
  }
}
