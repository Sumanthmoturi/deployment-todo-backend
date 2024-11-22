import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoService } from './todos.service';
import { TodoController } from './todos.controller';
import { MyLoggerService } from '../my-logger/my-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])], 
  providers: [TodoService, MyLoggerService],
  controllers: [TodoController],
})
export class TodoModule {}