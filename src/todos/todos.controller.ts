import { Controller, Get, Post, Body, Param, Delete,Request, Patch, Query, ParseIntPipe, BadRequestException, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { TodoService } from './todos.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { UpdateTodoStatusDto } from '../auth/dto/update-todo-status.dto';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { CustomRequest } from '../auth/interface';
@Controller('todo')
@UseGuards(AuthGuard)
export class TodoController {
  constructor(private todoService: TodoService) {}
  
  @Get()
  async findAll(@Request() req: CustomRequest, @Query('status') status?: 'In progress' | 'Completed'): Promise<Todo[]> {
    const userId = req.userId;
    return this.todoService.findAll(userId, status);
  }

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Request() req: CustomRequest): Promise<Todo> {
    const userId = req.userId;
    return this.todoService.create(createTodoDto, userId);
  }


  @Patch(':id/status')
  async updateStatus(@Param('id',ParseIntPipe) id: number, @Body() body: UpdateTodoStatusDto, @Request() req: CustomRequest): Promise<Todo> {
    const userId = req.userId;
    return this.todoService.updateStatus(id, body.status, userId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req: CustomRequest): Promise<{ message: string }> {
    const userId = req.userId; 
    await this.todoService.remove(id, userId);
    return { message: `Todo with ID ${id} has been deleted successfully.` };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, req: CustomRequest): Promise<Todo> {
    const userId = req.userId;
    return this.todoService.findOne(id, userId);
  }
}