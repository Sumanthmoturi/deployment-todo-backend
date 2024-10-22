import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';


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
    TodoModule, // Import the TodoModule
  ],
})
export class AppModule {}