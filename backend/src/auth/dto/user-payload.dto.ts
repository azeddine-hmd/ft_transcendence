import { ApiProperty } from '@nestjs/swagger';

export class UserPayloadDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  userId: number;
}
