import { Controller, Get, Post, Body, Param, Delete, Patch, Query, ParseIntPipe, HttpStatus, Res, BadRequestException, NotFoundException } from '@nestjs/common';
import { TodoService } from './todos.service';
import { Todo } from './todo.entity';


@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  async create(@Body() body: any) {
    return this.todoService.create(body);
  }

  @Get()
  async findAll(@Query('status') status: string) {
    return this.todoService.findAll(status);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.todoService.updateStatus(id, status);
  }

  @Delete(':id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todoService.remove(id);
  }

  @Get(':id')
  async getTodoById(@Param('id') id: number): Promise<Todo> {
    return this.todoService.findOne(id);
  }
}