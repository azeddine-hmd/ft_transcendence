import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}

  get<T = string>(name: string): T {
    const envVar = this.configService.get<T>(name);
    if (!envVar) throw new InternalServerErrorException(`${name} is undefined`);
    return envVar;
  }
}
