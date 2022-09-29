import { ApiProperty } from '@nestjs/swagger';

export class AddUserRelationDto {
  @ApiProperty()
  username: string;

  @ApiProperty({ enum: ['friend', 'block'] })
  relation_type: string;
}
