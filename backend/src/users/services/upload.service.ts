import { Injectable, Logger } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { extension } from 'mime-types';
import { EnvService } from 'src/conf/env.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private readonly envService: EnvService) {}

  async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadRootPath = this.envService.get<string>('UPLOAD_BASE_PATH');
    const ext = extension(file.mimetype);
    const filename = uuidv4() + '.' + ext;
    Logger.log(`saving file(name=${filename}) to storage`);
    writeFileSync(uploadRootPath + '/' + filename, file.buffer);
    return filename;
  }
}
