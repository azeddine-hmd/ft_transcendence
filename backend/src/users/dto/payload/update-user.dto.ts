import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  password?: string;
}
