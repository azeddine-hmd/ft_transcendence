import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class DisplayNameDto {
  @ApiProperty()
  @Length(8, 16)
  displayName: string;
}
