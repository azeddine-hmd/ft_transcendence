import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { WsException } from '@nestjs/websockets/errors';
import { Socket } from 'socket.io';

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

export async function handleWsException(client: Socket, exception: any) {
  if (exception instanceof WsException || exception instanceof HttpException) {
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
  }
  client.disconnect();
}
