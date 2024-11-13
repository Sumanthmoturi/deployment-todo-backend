import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import {APP_GUARD} from '@nestjs/core';
import { AppService } from './app.service';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
  
    TypeOrmModule.forRoot({
      type: 'postgres',  
      host: 'localhost', 
      port: 5432,        
      username: 'postgres', 
      password: 'new_password', 
      database: 'postgres', 
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, 
      synchronize: true,
    }),
    AuthModule, 
    TodoModule, 
    UserModule, 
    ThrottlerModule.forRoot([{
      name:'short',
      ttl:1000,
      limit:3,
}, {
  name:'long',
      ttl:60000,
      limit:100,
}]), MyLoggerModule,
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'public'),
}),
],

providers: [AppService, {
  provide:APP_GUARD,
  useClass:ThrottlerGuard,
}]
})

export class AppModule {}


