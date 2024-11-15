import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { MyLoggerService } from './my-logger/my-logger.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs:true,
  })
  const logger = app.get(MyLoggerService);
  app.useLogger(logger);
  const {httpAdapter} =app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  
  app.enableCors({
    origin: 'https://todosapp-bay.vercel.app/',
    credentials: true,

  });
  
  await app.init();
  return app.getHttpServer();

 
}
bootstrap().then(() => console.log('NestJS app running in serverless mode.'));