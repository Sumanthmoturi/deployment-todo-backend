import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoService } from './todos.service';
import { TodoController } from './todos.controller';
import { User } from '../auth/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}