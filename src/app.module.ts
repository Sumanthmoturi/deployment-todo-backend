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
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
],

providers: [AppService, {
  provide:APP_GUARD,
  useClass:ThrottlerGuard,
}]
})

export class AppModule {}


