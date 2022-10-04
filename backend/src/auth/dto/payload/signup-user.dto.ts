import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

export class SignupUserDto {
  @ApiProperty({
    example: 'azeddine',
    description: 'must be between 8-10 in length, and alphanumeric',
  })
  @Length(8, 10)
  @IsAlphanumeric()
  username: string;

  @ApiProperty({
    example: '12345678',
    description: 'must be between 8-10 in length, and alphanumeric',
  })
  @IsAlphanumeric()
  @Length(8, 16)
  password: string;

  @ApiProperty({
    example: 'Azeddine Hamdaoui',
  })
  @IsAlphanumeric()
  @Length(8, 20)
  displayName: string;
}
