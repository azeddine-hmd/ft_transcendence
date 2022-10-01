import { ApiProperty } from '@nestjs/swagger';

export enum FriendsStatus {
  Neutral = 'neutral',
  Pending = 'pending',
  Accept = 'accept',
  Friends = 'friends',
}

export class RelationResponse {
  @ApiProperty({ enum: FriendsStatus })
  friends: FriendsStatus;

  @ApiProperty()
  blocked: boolean;
}
