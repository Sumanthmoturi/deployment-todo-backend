import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoService } from './todos.service';
import { TodoController } from './todos.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Todo])], 
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}