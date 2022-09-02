import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Redirect,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @LocalAuthGuard
  @Post('/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  async register(@Body() CreateLoginDto: CreateLoginDto) {
    return this.authService.registerUser(CreateLoginDto);
  }

  @Get()
  @Redirect('http://localhost:3000/logout')
  logout() {
    return {
      redirection: true,
    };
  }
}
