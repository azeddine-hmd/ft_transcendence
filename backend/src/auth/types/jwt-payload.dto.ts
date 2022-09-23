import { ApiProperty } from '@nestjs/swagger';

export class JwtPayload {
  @ApiProperty()
  username: string;

  @ApiProperty()
  userId: string;
}
