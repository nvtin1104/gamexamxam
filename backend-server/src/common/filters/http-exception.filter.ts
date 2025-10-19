import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const exceptionResponse = exception.getResponse();

        if (status === HttpStatus.BAD_REQUEST && typeof exceptionResponse === 'object') {
            const errorResponse = exceptionResponse as any;

            if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
                const formattedErrors = errorResponse.errors.map((error: any) => ({
                    field: error.property,
                    value: error.value,
                    message: Object.values(error.constraints || {}).join(', '),
                }));

                return response.status(status).json({
                    success: false,
                    message: errorResponse.message || errorResponse?.error[0]?.message || 'Dữ liệu không hợp lệ',
                    errors: formattedErrors,
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
            }
        }

        const message = typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any)?.message || (exceptionResponse as any)?.error[0]?.message || 'Lỗi server';

        response.status(status).json({
            success: false,
            message,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
