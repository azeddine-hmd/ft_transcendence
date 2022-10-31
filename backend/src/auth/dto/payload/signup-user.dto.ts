import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length, Matches, Validator } from 'class-validator';

export class SignupUserDto {
  @ApiProperty()
  @Length(8, 10)
  @IsAlphanumeric()
  username: string;

  @ApiProperty()
  @IsAlphanumeric()
  @Length(8, 16)
  password: string;

  @ApiProperty()
  @Matches(RegExp('^[A-Za-z0-9 ]+$'))
  @Length(8, 20)
  displayName: string;
}
