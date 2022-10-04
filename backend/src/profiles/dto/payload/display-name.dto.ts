import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class DisplayNameDto {
  @ApiProperty()
  @Length(8, 20)
  displayName: string;
}
