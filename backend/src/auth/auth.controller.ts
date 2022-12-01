import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Logger } from '@nestjs/common/services';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger/dist';
import { Request, Response } from 'express';
import { EnvService } from 'src/conf/env.service';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/payload/signin-user.dto';
import { SignupUserDto } from './dto/payload/signup-user.dto';
import { TfaCodeDto } from './dto/payload/tfa-secret.dto';
import { TfaDto } from './dto/payload/tfa.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { FTAuthGuard } from './guards/ft.guard';
import { JwtAuth } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  accessCookieOptions,
  refreshCookieOptions,
} from './utils/cookie-options';

@ApiTags('authentication')
@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly envService: EnvService,
    private readonly authService: AuthService,
  ) {}

  @ApiResponse({ status: 302 })
  @ApiOperation({ summary: 'Redirect to 42 authorization page' })
  @Get('/intra')
  @Redirect()
  intraAuth() {
    const intraAuthUrl = new URL(this.envService.get('INTRA_AUTH_URL'));
    intraAuthUrl.searchParams.set(
      'client_id',
      this.envService.get('CLIENT_ID'),
    );
    intraAuthUrl.searchParams.set(
      'redirect_uri',
      this.envService.get('BACKEND_HOST') + this.envService.get('REDIRECT_URI'),
    );
    intraAuthUrl.searchParams.set(
      'response_type',
      this.envService.get('RESPONSE_TYPE'),
    );
    return {
      url: intraAuthUrl.toString(),
    };
  }

  @ApiExcludeEndpoint()
  @FTAuthGuard
  @Get('/42/callback')
  @Redirect()
  async FTCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (req.user === undefined) throw new UnauthorizedException();
    const login = await this.authService.login(req.user, false);
    const frontendHost = this.envService.get('FRONTEND_HOST');
    res.cookie('refresh_token', login.tokens.refreshToken, {
      ...refreshCookieOptions,
    });
    res.cookie('access_token', login.tokens.accessToken, {
      ...accessCookieOptions,
    });
    const setCookieHeader = res.getHeader('Set-Cookie') as string[];
    const setCookieHedaerNew = setCookieHeader.map((cookie) => {
      const newCookie = cookie.replace(
        new RegExp('SameSite=None', 'g'),
        'SameSite=',
      );
      return newCookie;
    });
    res.setHeader('Set-Cookie', setCookieHedaerNew);
    let url = `${frontendHost}/user/profile`;
    if (login.tfa && login.tfa === 'pending') {
      url = `${frontendHost}/auth/tfa`;
    }
    return {
      url: url,
    };
  }

  @ApiResponse({ type: LoginResponseDto })
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: SignupUserDto })
  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() signupUserDto: SignupUserDto,
  ) {
    const user = await this.authService.register(signupUserDto);
    const login = await this.authService.login(
      {
        username: user.username,
        userId: user.userId,
        tfa: undefined,
      },
      false,
    );
    res.cookie('refresh_token', login.tokens.refreshToken, {
      ...refreshCookieOptions,
    });
    res.cookie('access_token', login.tokens.accessToken, {
      ...accessCookieOptions,
    });
    const setCookieHeader = res.getHeader('Set-Cookie') as string[];
    const setCookieHedaerNew = setCookieHeader.map((cookie) => {
      const newCookie = cookie.replace(
        new RegExp('SameSite=None', 'g'),
        'SameSite=',
      );
      return newCookie;
    });
    res.setHeader('Set-Cookie', setCookieHedaerNew);
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
  async signin(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (req.user === undefined) throw new UnauthorizedException();
    const login = await this.authService.login(req.user, false);
    res.cookie('refresh_token', login.tokens.refreshToken, {
      ...refreshCookieOptions,
    });
    res.cookie('access_token', login.tokens.accessToken, {
      ...accessCookieOptions,
    });
    const setCookieHeader = res.getHeader('Set-Cookie') as string[];
    const setCookieHedaerNew = setCookieHeader.map((cookie) => {
      const newCookie = cookie.replace(
        new RegExp('SameSite=None', 'g'),
        'SameSite=',
      );
      return newCookie;
    });
    res.setHeader('Set-Cookie', setCookieHedaerNew);
    let url = `/user/profile`;
    if (login.tfa && login.tfa === 'pending') {
      url = `/auth/tfa`;
    }
    return {
      path: url,
    };
  }

  @ApiOperation({ summary: 'Logout out current user' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @JwtAuth
  @Get('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (req.user === undefined) throw new UnauthorizedException();
    res.cookie('access_token', '', { expires: new Date(0), httpOnly: true });
    res.cookie('refresh_token', '', {
      expires: new Date(0),
      path: '/api/auth/refresh',
      httpOnly: true,
    });
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
  @Post('/refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log(`refresh_token: ${req.cookies.refresh_token}`);
    const accessToken = this.authService.refreshAcessToken({
      expiredToken: req.cookies.access_token,
      refreshToken: req.cookies.refresh_token,
    });
    res.cookie('access_token', accessToken, {
      ...accessCookieOptions,
    });
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

  @ApiOperation({ summary: 'get otp uri for current user' })
  @Get('/tfa/otpauth')
  async getOtpAuthUri(@Req() req: Request) {
    const { jwtPayload, expired } = this.authService.verifyJwtToken(
      req.cookies.access_token,
    );
    if (expired) throw new UnauthorizedException('token expired');
    req.user = jwtPayload;
    const otpAuthUri = await this.authService.getOtpAuthUri(req.user);
    return {
      otpauth_uri: otpAuthUri,
    };
  }

  @ApiOperation({ summary: 'verify scanned secret' })
  @Post('/tfa/verify')
  async verifyTfaCode(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() tfaCodeDto: TfaCodeDto,
  ) {
    const { jwtPayload, expired } = this.authService.verifyJwtToken(
      req.cookies.access_token,
    );
    if (expired) throw new UnauthorizedException('token expired');
    req.user = jwtPayload;
    console.log(`verifyTfaCode method called with code=${tfaCodeDto.code}`);
    const verified = await this.authService.verifyTfa(
      req.user,
      tfaCodeDto.code,
    );
    if (verified) {
      const login = await this.authService.login(req.user, verified);
      res.cookie('refresh_token', login.tokens.refreshToken, {
        ...refreshCookieOptions,
      });
      res.cookie('access_token', login.tokens.accessToken, {
        ...accessCookieOptions,
      });
      const setCookieHeader = res.getHeader('Set-Cookie') as string[];
      const setCookieHedaerNew = setCookieHeader.map((cookie) => {
        const newCookie = cookie.replace(
          new RegExp('SameSite=None', 'g'),
          'SameSite=',
        );
        return newCookie;
      });
      res.setHeader('Set-Cookie', setCookieHedaerNew);
    } else {
      throw new BadRequestException('invalid  code');
    }
  }
}
