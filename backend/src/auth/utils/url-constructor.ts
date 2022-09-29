import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

export function getIntraAuthUrl(configService: ConfigService): string {
  const backendHost = configService.get<string>('BACKEND_HOST');
  const intraAuthUrl = configService.get<string>('INTRA_AUTH_URL');
  const clientId = configService.get<string>('CLIENT_ID');
  const redirect_uri = configService.get<string>('REDIRECT_URI');
  const responseType = configService.get<string>('RESPONSE_TYPE');

  if (
    !backendHost ||
    !intraAuthUrl ||
    !clientId ||
    !redirect_uri ||
    !responseType
  ) {
    throw new InternalServerErrorException();
  }

  const ftAuthUrl = new URL(intraAuthUrl);
  ftAuthUrl.searchParams.set('client_id', clientId);
  ftAuthUrl.searchParams.set('redirect_uri', backendHost + redirect_uri);
  ftAuthUrl.searchParams.set('response_type', responseType);

  return ftAuthUrl.toString();
}
