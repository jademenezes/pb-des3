import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// Middleware para logar as requisições e respostas da API
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  logger = new Logger('HTTP');

  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req;
    const reqTime = new Date().getTime();

    this.logger.log(`Logging HTTP Request ${method} ${url}`);

    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime();

      if (statusCode === 200 || statusCode === 201) {
        this.logger.log(
          `Response ${method} ${url} ${statusCode} Successful - ${resTime - reqTime} ms`,
        );
      }
    });
    next();
  }
}
