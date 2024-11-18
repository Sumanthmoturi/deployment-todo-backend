import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { MyLoggerService } from './my-logger/my-logger.service';
import * as cors from 'cors'; 
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs:true,
  })
  const logger = app.get(MyLoggerService);
  app.useLogger(logger);
  const {httpAdapter} =app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  
  app.use(cors({
    origin: 'https://todosapp-kappa-nine.vercel.app/',
    credentials: true,
    methods:'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders:['Content-Type', 'Authorization'],
  }));

  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  logger.log(`Backend is running on http://localhost:${port} or on Render at https://your-deployment-url.onrender.com`);
}
bootstrap();