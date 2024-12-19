import { Controller, Get, Post, Body, Param, Delete,Request, Patch, Query, ParseIntPipe, BadRequestException, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { TodoService } from './todos.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { UpdateTodoStatusDto } from '../auth/dto/update-todo-status.dto';
import { AuthGuard } from '../auth/jwt-auth.guard';
@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}
  

  @UseGuards(AuthGuard)
  @Get() 
  async getTodosForUser(@Request() req): Promise<Todo[]> {
    const userId = req.user.userId; 
    return this.todoService.findAll(userId); 
  }

  
  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Request() req, @Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    const userId = req.user.userId;
    return this.todoService.create(createTodoDto, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Request() req,
    @Param('id') id: number,
    @Body() body: UpdateTodoStatusDto,
  ): Promise<Todo> {
    const userId = req.user.userId;
    return this.todoService.updateStatus(id, body.status, userId);
  }
  
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: number): Promise<{ message: string }> {
    const userId = req.user.userId;
    await this.todoService.remove(id, userId);
    return { message: `Todo with ID ${id} has been deleted successfully.` };
  }
  
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Todo> {
    const userId = req.user.userId;
    return this.todoService.findOne(id, userId);
  }
}