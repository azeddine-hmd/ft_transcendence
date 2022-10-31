import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { JwtAuth } from '../../auth/guards/jwt-auth.guard';
import { Profile } from '../../profiles/entities/profile.entity';
import { profileToProfileResponse } from '../../profiles/utils/entity-payload-converter';
import { Pair } from '../../utils/pair';
import { FriendDto } from '../dto/payload/add-friend-payload.dto';
import { FriendsResponse } from '../dto/response/friends-response.dto';
import {
  FriendsStatus,
  RelationResponse,
} from '../dto/response/other-user-relation.dt';
import { UserRelation } from '../entities/user-relation.entity';
import { RelationsService } from '../services/relations.service';
import { relationToFriendsStatus } from '../utils/entity-response-converter';

@ApiTags('users relations')
@ApiBearerAuth()
@JwtAuth
@Injectable()
@Controller('api/users/relations')
export class RelationsController {
  constructor(private readonly relationsService: RelationsService) {}

  @ApiResponse({
    status: 200,
  })
  @ApiOperation({ summary: 'Add Friend' })
  @ApiBody({
    type: FriendDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/friend')
  async addFriend(@Req() req: Express.Request, @Body() friendDto: FriendDto) {
    if (req.user === undefined) throw new UnauthorizedException();
    await this.relationsService.addFriend(
      req.user.userId,
      friendDto.friend_username,
    );
  }

  @ApiResponse({
    status: 200,
  })
  @ApiOperation({ summary: 'Remove Friend' })
  @ApiBody({
    type: FriendDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/unfriend')
  async removeFriend(
    @Req() req: Express.Request,
    @Body() friendDto: FriendDto,
  ) {
    if (req.user === undefined) throw new UnauthorizedException();
    await this.relationsService.removeFriend(
      req.user.userId,
      friendDto.friend_username,
    );
  }

  @ApiResponse({
    status: 200,
    type: [FriendsResponse],
  })
  @ApiOperation({ summary: 'Get Friends List of current user' })
  @Get('/friends')
  async getFriends(@Req() req: Express.Request): Promise<FriendsResponse[]> {
    if (req.user === undefined) throw new UnauthorizedException();
    const pairs: Pair<UserRelation, Profile>[] =
      await this.relationsService.getAllFriendsRelations(req.user.userId);

    return pairs.map((pair: Pair<UserRelation, Profile>) => {
      if (req.user === undefined) throw new UnauthorizedException();

      return {
        profile: profileToProfileResponse(pair.second),
        friends_status: relationToFriendsStatus(pair.first, req.user.userId),
        is_blocked: pair.first.isBlocked,
      };
    });
  }

  @ApiResponse({
    status: 200,
    type: RelationResponse,
  })
  @ApiOperation({
    summary: 'Get current user relation with other user',
  })
  @Get('/username/:username')
  async getRelationWithOther(
    @Req() req: Express.Request,
    @Param('username') otherUsername: string,
  ): Promise<RelationResponse> {
    if (req.user === undefined) throw new UnauthorizedException();
    const relation = await this.relationsService.getRelation(
      req.user.userId,
      otherUsername,
    );
    if (!relation) {
      return {
        friends: FriendsStatus.Neutral,
        blocked: false,
      };
    } else {
      return {
        friends: relationToFriendsStatus(relation, req.user.userId),
        blocked: relation.isBlocked,
      };
    }
  }

  @ApiResponse({
    status: 200,
  })
  @ApiOperation({ summary: 'Block user' })
  @ApiBody({
    type: FriendDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/block')
  async block(@Req() req: Express.Request, @Body() addFriendDto: FriendDto) {
    if (req.user === undefined) throw new UnauthorizedException();
    await this.relationsService.blockUser(
      req.user.userId,
      addFriendDto.friend_username,
    );
  }

  @ApiResponse({
    status: 200,
  })
  @ApiOperation({ summary: 'Unblock user' })
  @ApiBody({
    type: FriendDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/unblock')
  async unblock(@Req() req: Express.Request, @Body() addFriendDto: FriendDto) {
    if (req.user === undefined) throw new UnauthorizedException();
    await this.relationsService.unblockUser(
      req.user.userId,
      addFriendDto.friend_username,
    );
  }
}
