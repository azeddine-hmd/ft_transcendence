import {
  Controller,
  Get,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@JwtAuthGuard
@Controller('users')
@Injectable()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUserInfo(@Req() req: any): Promise<UserDto> {
    const user = await this.usersService.findOne(req.user.username);
    if (!user) {
      throw new NotFoundException();
    }
    return {
      username: user.username,
      profileImageUrl: user.profileImageUrl,
    };
  }
}
