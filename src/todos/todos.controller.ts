import { Controller, Get, Post, Body, Param, Delete,Request, Patch, Query, ParseIntPipe, BadRequestException, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { TodoService } from './todos.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { UpdateTodoStatusDto } from '../auth/dto/update-todo-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)  
  @Get()
  async findAll(@Request() req,@Query('status') status?: 'In progress' | 'Completed'): Promise<Todo[]> {
    const userId = req.user.userId;
    return this.todoService.findAll(userId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Request() req): Promise<Todo> {
    const userId = req.user.userId;
    return this.todoService.create(createTodoDto, userId);
  }


  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id',ParseIntPipe) id: number, @Body() body: UpdateTodoStatusDto, @Request() req): Promise<Todo> {
    const userId = req.user.userId;
    return this.todoService.updateStatus(id, body.status, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    const userId = req.user.userId;
    await this.todoService.remove(id, userId);
    return { message: `Todo with ID ${id} has been deleted successfully.` };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number, @Request() req): Promise<Todo> {
    const userId = req.user.userId;
    return this.todoService.findOne(id, userId);
  }
}