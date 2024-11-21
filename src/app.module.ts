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
      host: 'dpg-cssaaphu0jms73e89el0-a', 
      port: 5432,        
      username: 'todos_app_db_1frl_user', 
      password: 'LpuzpwJbu8XWDNHJndcemzW14K7mekBx', 
      database: 'todos_app_db_1frl',  
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, 
      synchronize: true,
      extra: {
        ssl: {
          rejectUnauthorized: false, 
        },
      }
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


