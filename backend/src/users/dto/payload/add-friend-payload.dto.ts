import { ApiProperty } from '@nestjs/swagger';

export class AddFriendDto {
  @ApiProperty()
  friend_username: string;
}
