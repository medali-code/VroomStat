import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';
import { DatabaseQueryErrors } from '../enums/typeorm-errors.enum';

  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      const status = exception?.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
  
      console.error('Unhandled exception:', exception);
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception?.message || 'Unexpected error',
      });
    }
  }
  
