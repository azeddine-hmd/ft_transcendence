import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Logger,
  Post,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
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
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/payload/refresh.dto';
import { SigninUserDto } from './dto/payload/signin-user.dto';
import { SignupUserDto } from './dto/payload/signup-user.dto';
import { TfaDto } from './dto/payload/tfa.dto';
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
  ) {}

  @ApiResponse({ status: 302 })
  @ApiOperation({ summary: 'Redirect to 42 authorization page' })
  @Get('/intra')
  @Redirect()
  intraAuth() {
    return { url: getIntraAuthUrl(this.configService) };
  }

  @ApiExcludeEndpoint()
  @FTAuthGuard
  @Get('/42/callback')
  @Redirect(`${process.env.FRONTEND_HOST}/auth/42/callback`)
  FTCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (req.user === undefined) throw new UnauthorizedException();
    const refreshToken = this.authService.getRefreshToken(req.user);
    const accessToken = this.authService.login(req.user);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('access_token', accessToken);
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
  login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): LoginResponseDto {
    if (req.user === undefined) throw new UnauthorizedException();
    const login = this.authService.login(req.user);
    res.cookie('refresh_token', login.refreshToken, { httpOnly: true });
    return {
      access_token: login.accessToken,
    };
  }

  @ApiResponse({ status: 200, description: 'verify current user credentials' })
  @ApiOperation({ summary: 'Verify current user session access token' })
  @ApiBearerAuth()
  @JwtAuth
  @HttpCode(HttpStatus.OK)
  @Get('/verify')
  async verify(@Req() req: Request) {
    if (req.user === undefined) throw new UnauthorizedException();
    Logger.log(`user ${req.user.username} verified`);
  }

  @ApiOperation({ summary: 'Refresh current user access token' })
  @ApiBody({ type: RefreshDto })
  @Get('/refresh')
  refresh(
    @Req() req: Request,
    @Body() refreshDto: RefreshDto,
  ): LoginResponseDto {
    if (!req.headers.authorization) throw new BadRequestException();
    const accessToken = this.authService.refreshAcessToken({
      expiredToken: req.headers.authorization,
      refreshToken: refreshDto.refresh_token,
    });
    return {
      access_token: accessToken,
    };
  }

  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'enable/disable Two Way factor for current user' })
  @ApiBearerAuth()
  @ApiBody({ type: TfaDto })
  @JwtAuth
  @Post('/tfa')
  async tfa(@Req() req: Request, @Body() tfaDto: TfaDto) {
    if (req.user === undefined) throw new UnauthorizedException();
    await this.authService.tfa(req.user.username, tfaDto.value);
  }
}
