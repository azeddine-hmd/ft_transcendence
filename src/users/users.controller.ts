import { Body, Controller, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  @SetMetadata('roles', ['admin'])
  create(@Body() body: any) {
    return 'create response body';
  }
}
