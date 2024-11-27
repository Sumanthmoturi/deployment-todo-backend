import { Controller, Get, Post, Body, Param, Delete, Patch, Query, ParseIntPipe, BadRequestException, NotFoundException, ValidationPipe,UsePipes } from '@nestjs/common';
import { TodoService } from './todos.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { UpdateTodoStatusDto } from '../auth/dto/update-todo-status.dto';


@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  async create(@Body() body: CreateTodoDto): Promise<Todo> {
    console.log('Creating a new Todo:', body);
    return this.todoService.create(body);
  }

  @Get()
  async findAll(@Query('status') status?: 'In progress' | 'Completed') {
    console.log(`Fetching all todos. Status filter: ${status || 'none'}`);
    if (status && !['In progress', 'Completed'].includes(status)) {
      console.error(`Invalid status provided: ${status}`);
      throw new BadRequestException('Invalid status. Must be "In progress" or "Completed".');
    }
    return this.todoService.findAll(status);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTodoStatusDto): Promise<Todo> {
    console.log(`Updating status for Todo ID ${id}:`, body);
    return this.todoService.updateStatus(id, body.status);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
    console.log(`Attempting to delete Todo with ID: ${id}`);
    await this.todoService.remove(id);
  console.log(`Todo with ID ${id} deleted successfully`);
  return { message: `Todo with ID ${id} has been deleted successfully.` };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    console.log(`Fetching Todo with ID: ${id}`);
    return this.todoService.findOne(id);
  }
}