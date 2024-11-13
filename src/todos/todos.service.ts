import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name); // Logger instance

  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(todoDto: CreateTodoDto): Promise<Todo> {
    if (!todoDto.name || !todoDto.description || !todoDto.time || !todoDto.status) {
      this.logger.warn('Missing required fields: name, description, time, or status');
      throw new BadRequestException('Missing required fields: name, description, time, or status');
    }

    const time = Number(todoDto.time);
    if (isNaN(time) || time <= 0) {
      this.logger.warn(`Invalid time value provided: ${todoDto.time}`);
      throw new BadRequestException('Invalid time value provided. Time must be a positive number.');
    }

    
    const todoExists = await this.todoRepository.findOne({ where: { name: todoDto.name } });
    if (todoExists) {
      this.logger.warn(`Todo with name "${todoDto.name}" already exists`);
      throw new ConflictException('Todo with this name already exists');
    }
    const todo = this.todoRepository.create({
      ...todoDto,
      time,
    });

    const savedTodo = await this.todoRepository.save(todo);
    this.logger.log(`Todo created successfully: ${savedTodo.name}`);

    return savedTodo;
  }

  async findAll(status?: string, take?: number, skip?: number): Promise<Todo[]> {
    const where = status ? { status } : {};
    const todos = await this.todoRepository.find({ where, take, skip });
    this.logger.log(`Found ${todos.length} todos with status: ${status}`);
    return todos;
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    
    if (!todo) {
      this.logger.warn(`Todo with ID ${id} not found`);
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    this.logger.log(`Found Todo with ID ${id}: ${todo.name}`);
    return todo;
  }

  async updateStatus(id: number, status: string): Promise<Todo> {
    const todo = await this.findOne(id);

    if (!status || (status !== 'in progress' && status !== 'completed')) {
      this.logger.warn(`Invalid status value provided for Todo ID ${id}: ${status}`);
      throw new BadRequestException('Invalid status value. Status must be "in progress" or "completed".');
    }

    todo.status = status;
    const updatedTodo = await this.todoRepository.save(todo);
    this.logger.log(`Updated status of Todo ID ${id} to ${status}`);
    return updatedTodo;
  }

  async remove(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`Todo with ID ${id} not found for deletion`);
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    this.logger.log(`Todo with ID ${id} has been deleted`);
  }
}
