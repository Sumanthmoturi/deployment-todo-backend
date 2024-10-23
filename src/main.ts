import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLoggerService } from './logger/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new CustomLoggerService();

  app.useLogger(logger); // Use custom logger

  app.enableCors({
    origin: 'http://localhost:3002',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001);
  logger.log('Backend is running on http://localhost:3001');
}
bootstrap();