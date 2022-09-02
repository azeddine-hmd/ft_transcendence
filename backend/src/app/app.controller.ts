import {
  Controller,
  Get,
  Injectable,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@JwtAuthGuard
@Controller('app')
@Injectable()
export class AppController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  async getUsername(@Request() req: Express.Request) {
    if (req.user) {
      const foundUser = await this.usersService.findOne(
        (req.user as any).username,
      );
      if (foundUser) return { username: foundUser.username };
    }
    throw new NotFoundException();
  }
}
