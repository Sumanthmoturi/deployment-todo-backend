import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { MyLoggerService } from './my-logger/my-logger.service';
import { NextFunction, Request} from 'express';
import { ValidationPipe } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs:true,
  })
  const logger = app.get(MyLoggerService);
  app.useLogger(logger);
  const {httpAdapter} =app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  
  
app.use((req: Request, _: any, next: NextFunction) => {
  const origin = req.get('origin');
  console.log('Incoming request from origin:', origin);
  next();
});
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
);

  app.enableCors({
    origin: 'https://main.d2ad04cm30qoi2.amplifyapp.com',
    credentials: true, 
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });


  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  logger.log(`Backend is running on http://localhost:${port} or on Render at https://deployment-todo-backend.onrender.com`);
}
bootstrap();