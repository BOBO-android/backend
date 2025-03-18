import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const HOST = configService.get<string>('HOST');
  const PORT = configService.get<string>('PORT');

  app.setGlobalPrefix('api/v1', { exclude: ['/'] });

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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(PORT, () => {
    console.log(`App running in ${HOST}:${PORT}`);
    console.log(`Api docs: ${HOST}:${PORT}/api-docs`);
  });
}
bootstrap();
