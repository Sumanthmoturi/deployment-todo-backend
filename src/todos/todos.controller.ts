import { Controller, Get, Post, Body, Param, Delete, Patch, Query, ParseIntPipe, BadRequestException, ValidationPipe, UsePipes } from '@nestjs/common';
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
  async findAll(@Query('status') status?: string) {
    console.log(`Fetching all todos. Status filter: ${status || 'none'}`);

    if (status) {
      // Format the status to match the expected case
      const formattedStatus = this.capitalizeStatus(status);
      
      // Check if the status is valid
      if (formattedStatus !== 'In progress' && formattedStatus !== 'Completed') {
        console.error(`Invalid status provided: ${formattedStatus}`);
        throw new BadRequestException('Invalid status. Must be "In progress" or "Completed".');
      }

      // Use the valid formatted status
      return this.todoService.findAll(formattedStatus);
    }

    return this.todoService.findAll();
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTodoStatusDto): Promise<Todo> {
    console.log(`Updating status for Todo ID ${id}:`, body);

    const formattedStatus = this.capitalizeStatus(body.status);

    // Validate the formatted status
    if (formattedStatus !== 'In progress' && formattedStatus !== 'Completed') {
      throw new BadRequestException('Invalid status. Must be "In progress" or "Completed".');
    }

    return this.todoService.updateStatus(id, formattedStatus);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
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

  private capitalizeStatus(status: string): 'In progress' | 'Completed' {
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    if (formattedStatus === 'In progress' || formattedStatus === 'Completed') {
      return formattedStatus as 'In progress' | 'Completed';
    }
    throw new BadRequestException('Invalid status. Must be "In progress" or "Completed".');
  }
}
