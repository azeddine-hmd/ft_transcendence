import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { writeFileSync } from 'fs';
import { extension } from 'mime-types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadRootPath = this.configService.get<string>('UPLOAD_BASE_PATH');
    if (typeof uploadRootPath === 'undefined')
      throw new InternalServerErrorException();
    const ext = extension(file.mimetype);
    const filename = uuidv4() + '.' + ext;
    Logger.log(`saving file(name=${filename}) to storage`);
    writeFileSync(uploadRootPath + '/' + filename, file.buffer);
    return filename;
  }
}
