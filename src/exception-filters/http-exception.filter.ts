import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose';

// Filtro para tratar erros de requisição
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('Exception');
  constructor() {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default para erro interno do servidor
    let statusCode = 500;
    let message = 'Internal Server Error';
    let error = 'Error';

    // Tratando erros de requisição HTTP
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const response = exceptionResponse as {
          message?: string;
          error?: string;
        };
        message = response.message;
        error = response.error || exception.name;
      }
    }

    // Tratando erro de campo duplicado MongoDB
    if (exception instanceof MongoError && exception.code === 11000) {
      statusCode = 409;
      message =
        'A store with this address and postal code is already on the database!';
      error = 'Conflict';
    }

    // Tratando erros de validação do mongoose
    if (exception instanceof mongoose.Error.ValidationError) {
      statusCode = 400;
      message = Object.values(exception['errors'])
        .map((err: any) => `${err.message}`)
        .join(';');
      error = 'Validation Error';
    }

    // Padronizando a resposta de erro
    const errorResponse = {
      statusCode,
      message,
      error,
    };

    // Logando erro no console
    this.logger.error(
      `${message} ${error} - ${statusCode} | ${request.method} ${request.url}`,
    );

    // Envio da resposta para o cliente
    response.status(statusCode).json(errorResponse);
  }
}
