import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { MyLoggerService } from './my-logger/my-logger.service';
import { NextFunction, Request, Response } from 'express';
import { ValidationPipe } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(MyLoggerService);
  app.useLogger(logger);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url === '/favicon.ico') {
      res.status(204).end(); 
    } else {
      next();
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const isDevelopment = process.env.NODE_ENV !== 'production';
  const frontendUrl = isDevelopment
    ? process.env.DEV_FRONTEND_URL
    : process.env.FRONTEND_URL;

  console.log('CORS Origin:', frontendUrl);
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Backend is running on ${isDevelopment ? `http://localhost:${port}` : 'https://deployment-todo-backend.onrender.com'}`);
}

bootstrap();
