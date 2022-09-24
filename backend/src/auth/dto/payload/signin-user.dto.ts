import { ApiProperty } from '@nestjs/swagger';

export class SigninUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
