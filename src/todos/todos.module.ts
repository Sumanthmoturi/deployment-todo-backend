import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoService } from './todos.service';
import { TodoController } from './todos.controller';
import { User } from '../auth/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Todo,User])], 
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}