import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter<T> implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    return response.status(500).json({
      code: 500,
      url: request.url,
      message: exception.message,
    });
  }
}
