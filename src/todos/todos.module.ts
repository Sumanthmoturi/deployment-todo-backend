import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoService } from './todos.service';
import { TodoController } from './todos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])], // Register Todo repository here
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
