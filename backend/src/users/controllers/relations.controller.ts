import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { Profile } from 'src/profiles/entities/profile.entity';
import { profileToProfileResponse } from 'src/profiles/utils/entity-payload-converter';
import { Pair } from 'src/utils/pair';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddFriendDto } from '../dto/payload/add-friend-payload.dto';
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
@JwtAuthGuard
@Injectable()
@Controller('api/users/relations')
export class RelationsController {
  constructor(private readonly relationsService: RelationsService) {}

  @ApiResponse({
    status: 200,
  })
  @ApiOperation({ summary: 'Add Friend from username' })
  @ApiBody({
    type: AddFriendDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/friend')
  async addFriend(@Req() req: any, @Body() addFriendDto: AddFriendDto) {
    await this.relationsService.addFriend(
      req.user.userId,
      addFriendDto.friend_username,
    );
  }

  @ApiResponse({
    status: 200,
    type: [FriendsResponse],
  })
  @ApiOperation({ summary: 'Get Friends List of current user' })
  @Get('/friends')
  async getFriends(@Req() req: any): Promise<FriendsResponse[]> {
    const pairs: Pair<UserRelation, Profile>[] =
      await this.relationsService.getAllFriendsRelations(req.user.userId);

    return pairs.map((pair: Pair<UserRelation, Profile>) => {
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
  @Get('/with/:username')
  async getRelationWithOther(
    @Req() req: any,
    @Param('username') otherUsername: string,
  ): Promise<RelationResponse> {
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
    type: AddFriendDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/block')
  async block(@Req() req: any, @Body() addFriendDto: AddFriendDto) {
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
    type: AddFriendDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/unblock')
  async unblock(@Req() req: any, @Body() addFriendDto: AddFriendDto) {
    await this.relationsService.unblockUser(
      req.user.userId,
      addFriendDto.friend_username,
    );
  }
}
