import { Controller, Injectable } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuth } from '../auth/guards/jwt-auth.guard';

@ApiTags('upload')
@ApiBearerAuth()
@JwtAuth
@Injectable()
@Controller('api')
export class UploadController {}
