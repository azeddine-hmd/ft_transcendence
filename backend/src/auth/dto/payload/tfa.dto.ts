import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class TfaDto {
  @ApiProperty()
  value: boolean;
}
