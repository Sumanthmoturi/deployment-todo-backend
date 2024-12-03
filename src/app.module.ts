import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { AppController } from './app.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
  
    TypeOrmModule.forRoot({
      type: 'postgres',  
      host: 'localhost', 
      port: 5432,        
      username: 'todos_user',
      password: 'secure_password',
      database: 'todos_app_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule, 
    TodoModule, 
    UserModule, 
    MyLoggerModule,
],
controllers:[AppController],
providers: [AppService],
})

export class AppModule {}


