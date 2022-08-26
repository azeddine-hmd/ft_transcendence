import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class CrossOriginInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const res: Response = context.switchToHttp().getResponse();
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    return next.handle();
  }
}
