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
      host: 'database-1.ctuoaiyu47oa.ap-south-1.rds.amazonaws.com', 
      port: 5432,        
      username: 'postgresql',
      password: 'Msumanth2177',
      database: 'database-1',
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


