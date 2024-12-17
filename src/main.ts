import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { MyLoggerService } from './my-logger/my-logger.service';
import { NextFunction,Response, Request} from 'express';
import { ValidationPipe } from '@nestjs/common'; 
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser'; 
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs:true,
  })

  app.use(cookieParser());

  const logger = app.get(MyLoggerService);
  app.useLogger(logger);
  const {httpAdapter} =app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  
  
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

const origin = 
    process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_URL 
    : 'http://localhost:3002';
console.log(`CORS Origin: ${origin}`);
  
    app.enableCors({
      origin: (origin, callback) => {
        if (process.env.NODE_ENV === 'production') {
          callback(null, true);
        } else {
          if (origin === 'http://localhost:3002') {
            callback(null, true);
          } else {
            callback(new Error('CORS not allowed for this origin'), false);
          }
        }
      },
      credentials: true,
      methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
      allowedHeaders: ['Content-Type', 'Authorization'],
    });


  const port = process.env.PORT || 80;
  await app.listen(port, '0.0.0.0');
  logger.log(`Backend is running on http://localhost:${port} or on Render at http://ec2-15-207-221-132.ap-south-1.compute.amazonaws.com`);
}
bootstrap();

