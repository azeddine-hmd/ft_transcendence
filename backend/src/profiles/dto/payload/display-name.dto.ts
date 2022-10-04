import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

export class DisplayNameDto {
  @ApiProperty()
  @IsAlphanumeric()
  @Length(8, 20)
  displayName: string;
}
