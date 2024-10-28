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

@Module({
  imports: [
    // Loads environment variables from a .env file
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
  
    TypeOrmModule.forRoot({
      type: 'postgres',  // Use PostgreSQL as the database
      host: 'localhost', // Database host
      port: 5432,        // Default PostgreSQL port
      username: 'postgres', // Your PostgreSQL username
      password: 'new_password', // Your PostgreSQL password
      database: 'postgres', 
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Synchronize the database schema with entities (only for development)
    }),
    AuthModule, // Import the AuthModule
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
}]), MyLoggerModule
],

providers: [AppService, {
  provide:APP_GUARD,
  useClass:ThrottlerGuard,
}]
})

export class AppModule {}


