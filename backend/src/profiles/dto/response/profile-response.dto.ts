import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger/dist';

export class ProfileResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiPropertyOptional()
  displayName: string;

  @ApiPropertyOptional()
  avatar: string;

  @ApiPropertyOptional()
  tfa?: boolean | undefined;
}
