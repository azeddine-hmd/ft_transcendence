import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger/dist';

export class ProfileResponseDto {
  @ApiProperty({ example: '807b56d2-41b9-4704-9b02-2ab2b5fda9cb' })
  id: string;

  @ApiProperty({ example: 'ahamdaou' })
  username: string;

  @ApiPropertyOptional({ type: 'string', example: 'azeddine' })
  displayName: string;

  @ApiPropertyOptional({
    type: 'string',
    example: 'https://cdn.intra.42.fr/users/ahamdaou.jpg',
  })
  avatar: string;
}
