import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guard/jwt.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  /**
   * Create the NestJS application using the AppModule and apply the global JWT authentication guard
   */
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    {
      origin: '*', // Allow all origins (you can specify specific origins if needed)
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
      allowedHeaders: 'Content-Type, Accept, Authorization', // Allowed headers
    }
  );
  app.useGlobalGuards(new JwtAuthGuard());
  /**
   * Swagger configuration with JWT authentication support
   */
  const config = new DocumentBuilder()
    .setTitle("TodoApp")
    .setDescription("TodoApp API documentation")
    .setVersion("1.0")
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    }, 'JWT-auth') // This second parameter is the name of the security scheme, which can be referenced in the @ApiSecurity decorator in your controllers.
    .build();
  /**
   * Create Swagger document and setup Swagger UI with JWT authentication support
   */
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
  /**
   * Start the NestJS application and listen on the specified port (default: 3000)
   */
  const listener = await app.listen(process.env.PORT ?? 3000);
  console.info(`Server is running on port ${listener.address().port}`);
}
bootstrap();
