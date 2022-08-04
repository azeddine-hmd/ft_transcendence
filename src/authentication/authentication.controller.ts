import { Controller, Get, Query } from '@nestjs/common';

@Controller('authentication')
export class AuthenticationController {
  @Get()
  authenticate(@Query('code') code: string) {
    return `code is: ${code}`;
  }

  @Get()
  authenticate_rejected(
    @Query('error') error: string,
    @Query('error_description') description: string,
  ) {
    return `error: ${error}\ndescription: ${description}`;
  }
}
