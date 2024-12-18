import { Controller, Get, Post, Body, Param, Delete,Request, Patch, Query, ParseIntPipe, BadRequestException, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { TodoService } from './todos.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { UpdateTodoStatusDto } from '../auth/dto/update-todo-status.dto';
import { JwtGuard } from '../auth/jwt-auth.guard';

@Controller('todo')
@UseGuards(JwtGuard)
export class TodoController {
  constructor(private todoService: TodoService) {}
  
  @Get()
  async findAll(@Request() req, @Query('status') status?: 'In progress' | 'Completed'): Promise<Todo[]> {
    const userId = req.user.id;
    return this.todoService.findAll(userId, status);
  }

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Request() req): Promise<Todo> {
    const userId = req.user.id;
    return this.todoService.create(createTodoDto, userId);
  }


  @Patch(':id/status')
  async updateStatus(@Param('id',ParseIntPipe) id: number, @Body() body: UpdateTodoStatusDto, @Request() req): Promise<Todo> {
    const userId = req.user.id;
    return this.todoService.updateStatus(id, body.status, userId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    const userId = req.user.id; 
    await this.todoService.remove(id, userId);
    return { message: `Todo with ID ${id} has been deleted successfully.` };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Todo> {
    const userId = req.user.id;
    return this.todoService.findOne(id, userId);
  }
}