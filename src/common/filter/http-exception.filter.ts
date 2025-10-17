import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Get status code from the exception or default to 500
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Create the custom error response
    const errorResponse = {
      data: null, // You can change this as needed
      message: exception.message || 'Internal server error',
      success: false,
      statusCode: status,
    };

    // Send the response with the error structure
    response.status(status).json(errorResponse);
  }
}
