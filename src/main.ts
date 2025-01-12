import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplica validação global
  app.useGlobalPipes(new ValidationPipe());

  // Aplica filtro global de erros
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurações para uso do Swagger
  const config = new DocumentBuilder()
    .setTitle('PB Desafio 3 API')
    .setDescription('Documentação para API do desafio 3 PB Node.js')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
