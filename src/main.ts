import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { MyLoggerService } from './my-logger/my-logger.service';
import { Request, Response } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs:true,
  })
  const logger = app.get(MyLoggerService);
  app.useLogger(logger);
  const {httpAdapter} =app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  
  app.use((req: Request, res: Response, next) => {
    const origin = req.get('origin');
    console.log('Incoming request from origin:', origin);
    next();
  });

  app.enableCors({
    origin: 'https://main.d2ad04cm30qoi2.amplifyapp.com/',
    credentials: true, 
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });


  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  logger.log(`Backend is running on http://localhost:${port} or on Render at https://deployment-todo-backend.onrender.com`);
}
bootstrap();