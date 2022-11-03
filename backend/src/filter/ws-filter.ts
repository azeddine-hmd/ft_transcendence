import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { WsException } from '@nestjs/websockets/errors';

@Catch(WsException, HttpException)
export class WsExceptionFilter extends BaseExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();
    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();
    const messages =
      error instanceof Object ? { ...error } : { message: error };
    client.emit(
      JSON.stringify({
        event: 'error',
        data: {
          ...messages,
        },
      }),
    );
    client.disconnect();
  }
}
