import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { MyLoggerService } from './my-logger/my-logger.service'; 

type MyResponseObj = {
  statusCode: number;
  timeStamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR, 
      timeStamp: new Date().toISOString(),
      path: request.url,
      response: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const exceptionMessage = 
        typeof exceptionResponse === 'string' 
          ? exceptionResponse 
          : (exceptionResponse as any).message || JSON.stringify(exceptionResponse);

      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.response = exceptionMessage;
    } else {
      console.error('Unexpected exception:', exception);
    }
    response.status(myResponseObj.statusCode).json(myResponseObj);

    this.logger.error(
      `Error occurred: ${JSON.stringify({
        statusCode: myResponseObj.statusCode,
        response: myResponseObj.response,
        method: request.method,
        url: request.url,
      })}`,
      exception instanceof Error ? exception.stack : null,
    );

    super.catch(exception, host);
  }
}