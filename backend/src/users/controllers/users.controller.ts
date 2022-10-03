import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Injectable,
  Logger,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { plainToClass } from 'class-transformer';
import { JwtAuth } from '../../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from '../dto/payload/update-user.dto';
import { UserResponseDto } from '../dto/response/user-response.dto';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@ApiBearerAuth()
@JwtAuth
@Injectable()
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 201,
    type: UserResponseDto,
  })
  @ApiOperation({ summary: 'Update user data', deprecated: true })
  @ApiBody({ type: UpdateUserDto })
  @Post('/update')
  async updateUsername(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (!(updateUserDto.password && updateUserDto.username)) {
      throw new BadRequestException();
    }
    const user = await this.usersService.updateUser(
      req.user.userId,
      updateUserDto,
    );
    if (!user) {
      throw new NotFoundException();
    }
    return plainToClass(UserResponseDto, user);
  }

  @ApiResponse({
    status: 200,
  })
  @ApiOperation({ summary: 'Delete current user' })
  @Delete()
  async deleteUser(@Req() req: any) {
    await this.usersService.removeById(req.user.userId);
    Logger.log(
      `UsersController#delete: user ${req.user.username} have been deleted`,
    );
  }
}
