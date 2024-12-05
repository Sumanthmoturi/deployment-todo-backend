import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { MyLoggerService } from './my-logger/my-logger.service';
import { NextFunction,Response, Request} from 'express';
import { ValidationPipe } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs:true,
  })
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

  app.enableCors({
    origin: 'http://ec2-13-201-22-238.ap-south-1.compute.amazonaws.com:3002',
    credentials: true, 
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });


  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  logger.log(`Backend is running on http://localhost:${port} or on Render at http://ec2-13-201-101-208.ap-south-1.compute.amazonaws.com:10000`);
}
bootstrap();

