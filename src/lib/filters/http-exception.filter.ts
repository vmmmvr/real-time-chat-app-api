// src/filters/http-exception.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    response.status(status).json({
      status: false,
      message: typeof message === 'string' ? message : (message as any).message,
      error: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
