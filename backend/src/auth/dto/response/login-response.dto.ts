import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR.eyJ1c2VybmFtZSI6ImZib3VpYmFvIi.W5fMva8mWcrzeh9RyG5LDPV4U',
    description: 'session access token',
  })
  access_token: string;
}
