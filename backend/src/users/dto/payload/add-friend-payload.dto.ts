import { ApiProperty } from '@nestjs/swagger';

export class FriendDto {
  @ApiProperty()
  friend_username: string;
}
