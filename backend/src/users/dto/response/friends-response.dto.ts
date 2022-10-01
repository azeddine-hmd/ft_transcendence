import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { ProfileResponse } from '../../../profiles/dto/response/profile-response.dto';
import { FriendsStatus } from './other-user-relation.dt';

export class FriendsResponse {
  @ApiProperty()
  profile: ProfileResponse;

  @ApiProperty({ enum: FriendsStatus })
  friends_status: FriendsStatus;

  @ApiProperty()
  is_blocked: boolean;
}
