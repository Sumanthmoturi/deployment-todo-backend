import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { MyLoggerService } from './my-logger/my-logger.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs:true,
  })
  const logger = app.get(MyLoggerService); // Get your logger service instance
  app.useLogger(logger);
  const {httpAdapter} =app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  
  app.enableCors({
    origin: process.env.FRONTEND_URL ||  'https://todosapp-kappa-nine.vercel.app/',
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
  });

  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  logger.log(`Backend is running on http://localhost:${port} or on Render at https://your-deployment-url.onrender.com`);
}
bootstrap();