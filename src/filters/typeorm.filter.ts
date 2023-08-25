import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(TypeError)
export class TypeormFilter<T> implements ExceptionFilter {
  catch(exception: TypeError, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    return response.status(500).json({
      code: 500,
      url: request.url,
      message: exception.message,
    });
  }
}
