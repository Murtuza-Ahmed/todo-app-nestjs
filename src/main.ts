import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { JwtAuthGuard } from './auth/guard/jwt.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  /**
   * Create the NestJS application using the AppModule and apply the global JWT authentication guard
   * ObserveInstrument is used to instrument the application for monitoring and observability
   */
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  /**
   * Global validation: every DTO in the app is actually validated now.
   * - whitelist strips unknown properties
   * - forbidNonWhitelisted rejects requests carrying unknown properties
   * - transform coerces types (e.g. query/param strings) to the DTO types
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const corsOrigin = process.env.CORS_ORIGIN ?? '*';
  app.enableCors({
    origin:
      corsOrigin === '*' ? '*' : corsOrigin.split(',').map((o) => o.trim()),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Accept, Authorization', // Allowed headers
  });
  app.useGlobalGuards(new JwtAuthGuard());
  /**
   * Swagger configuration with JWT authentication support
   */
  const config = new DocumentBuilder()
    .setTitle('TodoApp')
    .setDescription('TodoApp API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    ) // This second parameter is the name of the security scheme, which can be referenced in the @ApiSecurity decorator in your controllers.
    .build();
  /**
   * Create Swagger document and setup Swagger UI with JWT authentication support
   */
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  /**
   * Start the NestJS application and listen on the specified port (default: 3000)
   */
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.info(`Server is running on port ${port}`);
}
void bootstrap();
