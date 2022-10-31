import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';

export class DisplayNameDto {
  @ApiProperty()
  @Matches(RegExp('^[A-Za-z0-9 ]+$'))
  @Length(8, 20)
  displayName: string;
}
