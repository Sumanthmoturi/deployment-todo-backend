import { Controller, Get, Post, Body, Param, Delete, Patch, Query, ParseIntPipe, HttpStatus, Res, BadRequestException, NotFoundException } from '@nestjs/common';
import { TodoService } from './todos.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { Response } from 'express';
import { MyLoggerService } from '../my-logger/my-logger.service';

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly myLoggerService: MyLoggerService, // Injecting the custom logger
  ) {}

  @Post()
  async create(@Body() body: CreateTodoDto, @Res() res: Response) {
    try {
      await this.myLoggerService.log('Todo creation data received', 'TodoController');

      const todo = await this.todoService.create(body);

      await this.myLoggerService.log(`Todo created successfully with name: ${todo.name}`, 'TodoController');
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Todo created successfully',
        data: todo,
      });
    } catch (error) {
      await this.myLoggerService.error('Todo creation failed', error.stack);
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Todo creation failed',
        error: error.message,
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response, @Query('status') status?: string) {
    try {
      await this.myLoggerService.log('Fetching todos', 'TodoController');
      const todos = await this.todoService.findAll(status);

      await this.myLoggerService.log(`Found ${todos.length} todos with status: ${status || 'all'}`, 'TodoController');
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Found ${todos.length} todos`,
        data: todos,
      });
    } catch (error) {
      await this.myLoggerService.error('Fetching todos failed', error.stack);
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Fetching todos failed',
        error: error.message,
      });
    }
  }

  @Get(':id')
  async getTodoById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const todo = await this.todoService.findOne(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Todo retrieved successfully',
        data: todo,
      });
    } catch (error) {
      await this.myLoggerService.error('Fetching Todo failed', error.stack);
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Todo not found',
        error: error.message,
      });
    }
  }

  @Patch(':id/status')
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string, @Res() res: Response) {
    try {
      const updatedTodo = await this.todoService.updateStatus(id, status);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Status updated successfully',
        data: updatedTodo,
      });
    } catch (error) {
      await this.myLoggerService.error('Status update failed', error.stack);
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Status update failed',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      await this.todoService.remove(id);
      return res.status(HttpStatus.NO_CONTENT).json({
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Todo deleted successfully',
      });
    } catch (error) {
      await this.myLoggerService.error('Todo deletion failed', error.stack);
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Todo not found',
        error: error.message,
      });
    }
  }
}
