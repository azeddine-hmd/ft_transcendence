import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  Req,
} from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { profileToProfileResponse2 } from '../../profiles/utils/entity-payload-converter';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddFriendDto } from '../dto/payload/add-friend-payload.dto';
import { FriendsResponseDto } from '../dto/response/friends-response.dto';
import { UserRelation } from '../entities/user-relation.entity';
import { RelationsService } from '../services/relations.service';

@ApiTags('user relations')
@ApiBearerAuth()
@JwtAuthGuard
@Injectable()
@Controller('api/users')
export class RelationsController {
  constructor(private readonly relationsService: RelationsService) {}

  @ApiResponse({
    status: 200,
    description: 'add friend',
  })
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
    description: 'get friends',
  })
  @Get('/friends')
  async getFriends(@Req() req: any): Promise<FriendsResponseDto[]> {
    const relations = await this.relationsService.getFriends(req.user.userId);
    return relations.map((relation: UserRelation) => {
      return {
        profile: profileToProfileResponse2(relation.profile, relation.user2),
        is_blocked: relation.isBlocked,
      };
    });
  }
}
