import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { UpdateTodoStatusDto } from 'src/auth/dto/update-todo-status.dto';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>) {}

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const { name, description, time, status } = createTodoDto;
    const todo = this.todoRepository.create({
      name,
      description,
      time,
      status,
      user: { id: userId },
    });
    const savedTodo = await this.todoRepository.save(todo);
    this.logger.log(`Todo created successfully: ${savedTodo.name}`);
    return savedTodo;
  }

  async findAll(userId: number, status?: 'In progress' | 'Completed'): Promise<Todo[]> {
    const whereCondition = { user: { id: userId }, ...(status ? { status } : {}) };
    const todos = await this.todoRepository.find({ where: whereCondition });
    this.logger.log(`Todos fetched: ${JSON.stringify(todos)}`);
    return todos;
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    this.logger.log(`Fetching Todo with ID: ${id}`);
    const todo = await this.todoRepository.findOne({ where: { id, user: { id: userId } } });

    if (!todo) {
      this.logger.warn(`Todo with ID ${id} not found`);
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    this.logger.log(`Found Todo with ID ${id}: ${todo.name}`);
    return todo;
  }

  async updateStatus(id: number, status: 'In progress' | 'Completed', userId: number): Promise<Todo> {
    const todo = await this.findOne(id,userId);

    todo.status = status;
    return this.todoRepository.save(todo);
  }
  

  async remove(id: number, userId: number): Promise<void> {
    const result = await this.todoRepository.delete({ id, user: { id: userId } });
    if (result.affected === 0) {
      this.logger.warn(`Todo with ID ${id} not found for deletion`);
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    this.logger.log(`Todo with ID ${id} has been deleted`);
  }


  async updateTodo(
    id: number,
    updateTodoDto: UpdateTodoStatusDto,
    userId: number,
  ): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    if (updateTodoDto.name !== undefined) {
      todo.name = updateTodoDto.name;
    }
    if (updateTodoDto.description !== undefined) {
      todo.description = updateTodoDto.description;
    }
    if (updateTodoDto.time !== undefined) {
      todo.time = updateTodoDto.time;
    }
    if (updateTodoDto.status !== undefined) {
      todo.status = updateTodoDto.status;
    }

    return this.todoRepository.save(todo);
  }
}
