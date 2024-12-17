import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { AppController } from './app.controller';
import { JwtStrategy } from './auth/jwt.strategy';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
  
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:password@15.207.247.253:5432/postgres',
      autoLoadEntities: true, 
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
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



