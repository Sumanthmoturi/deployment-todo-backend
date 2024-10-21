
import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { TodoService } from './todos.service';

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
}


