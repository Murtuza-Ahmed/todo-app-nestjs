import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const listener = await app.listen(process.env.PORT ?? 3000);
  console.info(`Server is running on port ${listener.address().port}`);
}
bootstrap();
