import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddUserRelationDto } from './dto/payload/add-user-relation.dto';
import { UpdateUserDto } from './dto/payload/update-user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UserRelation } from './entities/user-relation.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@JwtAuthGuard
@Injectable()
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    type: UserResponseDto,
    status: 200,
    description: 'current logged-in user info',
  })
  @Get()
  async getUserInfo(@Req() req: any): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(req.user.username);
    if (!user) {
      throw new NotFoundException();
    }
    return plainToClass(UserResponseDto, user);
  }

  @ApiResponse({
    type: UserResponseDto,
    status: 201,
    description: 'update user info',
  })
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
    description: 'add relation between two users',
  })
  @ApiBody({
    type: AddUserRelationDto,
  })
  @Post('/add')
  async addUserRelation(
    @Req() req: any,
    @Body() addUserRelationDto: AddUserRelationDto,
  ): Promise<UserRelation> {
    const relation = await this.usersService.addUserRelation(
      req.user.userId,
      addUserRelationDto,
    );
    if (!relation) {
      //TODO: return informative error
      throw new NotFoundException();
    }
    return relation;
  }

  @ApiResponse({
    status: 200,
    description: 'get all friend of current logged-in user',
  })
  @ApiBody({
    type: UserRelation,
    isArray: true,
  })
  @Get('/friends')
  async getFriends(@Req() req: any) {
    const UserRelation = await this.usersService.getAllFriends(req.user.userId);
    if (!UserRelation) throw new InternalServerErrorException();
    return UserRelation;
  }

  @Delete()
  async deleteUser(@Req() req: any) {
    await this.usersService.removeById(req.user.userId);
    Logger.log(
      `UsersController#delete: user ${req.user.username} have been deleted`,
    );
  }
}
