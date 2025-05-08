import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  private logger: Logger = new Logger('ExceptionFilter');

  //* cuz getResponse exception return type
  // private isValidResponse(exception: object): exception is { message: string } {
  //   return 'message' in exception;
  // }
  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    console.dir(
      { exp: JSON.parse(JSON.stringify(exception)) },
      { depth: null },
    );
    const status = exception.getStatus();
    const httpExceptionErrors =
      (exception.getResponse() as any)?.message || exception.message;

    const defaultFailureHeader = {
      statusCode: status,
      message: httpExceptionErrors.toString(),
      timestamp: new Date().toISOString(),
      path: req.url,
    };

    res.status(status).json({
      ...defaultFailureHeader,
    });
  }
}
