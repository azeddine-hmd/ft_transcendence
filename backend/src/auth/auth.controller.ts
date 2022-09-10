import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTAuthGuard } from './guards/ft.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @LocalAuthGuard
  @Post('/login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  async register(@Body() CreateLoginDto: CreateUserDto) {
    return this.authService.registerUser(CreateLoginDto);
  }

  @Get()
  @Redirect('http://localhost:3000/logout')
  logout() {
    return '';
  }

  @FTAuthGuard
  @Get('/42/callback')
  @Redirect()
  async FTCallback(@Req() req: any) {
    const loginDto = await this.authService.login(req.user);
    return {
      url:
        'http://localhost:3000/auth/42/callback?access_token=' +
        loginDto.access_token,
    };
  }
}
