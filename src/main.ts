import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppLoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(AppLoggerService);
  const configService = app.get(ConfigService);
  const HOST = configService.get<string>('HOST');
  const PORT = configService.get<string>('PORT');

  process.on('uncaughtException', (err) => {
    logger.error(
      `Uncaught Exception: ${err.message}`,
      err.stack,
      'ExceptionHandler',
    );
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`, '', 'PromiseHandler');
  });

  // Config Cors
  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    credentials: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('BoBo API')
    .setDescription('API documentation for BoBo project')
    .setVersion('1.0')
    .addBearerAuth() // Enables authentication support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.setGlobalPrefix('api/v1', { exclude: ['/'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useLogger(logger);

  await app.listen(PORT, () => {
    console.log(`App running in ${HOST}:${PORT}`);
  });
}
bootstrap();
