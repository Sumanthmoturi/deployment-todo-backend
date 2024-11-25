import { Controller, Get, Post, Body, Param, Delete, Patch, Query, ParseIntPipe, BadRequestException, NotFoundException, ValidationPipe,UsePipes } from '@nestjs/common';
import { TodoService } from './todos.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { UpdateTodoStatusDto } from '../auth/dto/update-todo-status.dto';


@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: CreateTodoDto) {
    console.log('Creating a new Todo:', body);
    return this.todoService.create(body);
  }

  @Get()
  async findAll(@Query('status') status?: string) {
    console.log(`Fetching all todos. Status filter: ${status || 'none'}`);
    if (status && !['in progress', 'completed'].includes(status)) {
      console.error(`Invalid status provided: ${status}`);
      throw new BadRequestException('Invalid status. Must be "in progress" or "completed".');
    }
    return this.todoService.findAll(status);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateStatus(@Param('id',ParseIntPipe) id: number, @Body() UpdateTodoStatusDto: UpdateTodoStatusDto,) {
    return this.todoService.updateStatus(id, UpdateTodoStatusDto.status);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
    await this.todoService.remove(id);
  console.log(`Todo with ID ${id} deleted successfully`);
  return { message: `Todo with ID ${id} has been deleted successfully.` };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return this.todoService.findOne(id);
  }
}