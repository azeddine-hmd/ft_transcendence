import { ApiProperty } from '@nestjs/swagger';

export class AvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: Express.Multer.File;
}
