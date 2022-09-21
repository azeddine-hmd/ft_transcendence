import { ApiProperty } from '@nestjs/swagger';

export class FtProfileDto {
  @ApiProperty()
  ftId: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  avatar: string;
}
