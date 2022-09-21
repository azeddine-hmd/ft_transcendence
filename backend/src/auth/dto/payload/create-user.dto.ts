import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @Length(6, 10)
  // @Matches(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/)
  username: string;

  @ApiProperty()
  @Length(8, 16)
  // @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
  password: string;
}
