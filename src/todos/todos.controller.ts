import { Controller, Get, Post, Body, Param, Delete,Request, Patch, Query, ParseIntPipe, BadRequestException, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { TodoService } from './todos.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { UpdateTodoStatusDto } from '../auth/dto/update-todo-status.dto';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}
  
  @Get()
  async findAll(@Query('userId') userId: number,@Query('status') status?: 'In progress' | 'Completed'): Promise<Todo[]> {
    return this.todoService.findAll(userId, status);
  }

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Query('userId') userId: number): Promise<Todo> {
     return this.todoService.create(createTodoDto, userId);
  }


  @Patch(':id/status')
  async updateStatus(@Param('id',ParseIntPipe) id: number, @Body() body: UpdateTodoStatusDto, @Query('userId') userId: number,): Promise<Todo> {
    return this.todoService.updateStatus(id, body.status, userId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Query('userId') userId: number,): Promise<{ message: string }> {
    await this.todoService.remove(id, userId);
    return { message: `Todo with ID ${id} has been deleted successfully.` };
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number, @Query('userId') userId: number,): Promise<Todo> {
    return this.todoService.findOne(id, userId);
  }
}