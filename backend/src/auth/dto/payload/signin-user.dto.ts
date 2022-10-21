import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

export class SigninUserDto {
  @ApiProperty()
  @Length(8, 10)
  @IsAlphanumeric()
  username: string;

  @ApiProperty()
  @Length(8, 16)
  @IsAlphanumeric()
  password: string;
}
