import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { MyLoggerService } from '../my-logger/my-logger.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    private readonly myLoggerService: MyLoggerService,
  ) {}

  async create(todoDto: CreateTodoDto): Promise<Todo> {
    const { name, description, time, status } = todoDto;

    try {
      this.myLoggerService.log('Starting creation of a new Todo', 'TodoService');

      if (!name || !description || !time || !status) {
        const errorMessage = 'Missing required fields: name, description, time, or status';
        console.error(errorMessage);
        this.myLoggerService.error(errorMessage, 'TodoService');
        throw new BadRequestException(errorMessage);
      }

      const todoExists = await this.todoRepository.findOne({ where: { name } });
      if (todoExists) {
        const errorMessage = `Todo with name "${name}" already exists`;
        console.error(errorMessage);
        this.myLoggerService.error(errorMessage, 'TodoService');
        throw new ConflictException('A todo with this name already exists');
      }

      const todo = this.todoRepository.create(todoDto);
      const savedTodo = await this.todoRepository.save(todo);

      this.myLoggerService.log(`Todo "${savedTodo.name}" created successfully`, 'TodoService');
      return savedTodo;
    } catch (error) {
      console.error('Error during Todo creation:', error.message);
      this.myLoggerService.error('Error during Todo creation', error.stack);
      throw error;
    }
  }

  async findAll(status?: string): Promise<Todo[]> {
    try {
      this.myLoggerService.log('Fetching all Todos', 'TodoService');
      const where = status ? { status } : {};
      const todos = await this.todoRepository.find({ where });

      this.myLoggerService.log(`Found ${todos.length} Todos with status: ${status || 'all'}`, 'TodoService');
      return todos;
    } catch (error) {
      console.error('Error fetching Todos:', error.message);
      this.myLoggerService.error('Error fetching Todos', error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<Todo> {
    try {
      this.myLoggerService.log(`Fetching Todo with ID ${id}`, 'TodoService');
      const todo = await this.todoRepository.findOne({ where: { id } });
      if (!todo) {
        const errorMessage = `Todo with ID ${id} not found`;
        console.error(errorMessage);
        this.myLoggerService.error(errorMessage, 'TodoService');
        throw new NotFoundException(errorMessage);
      }
      return todo;
    } catch (error) {
      console.error(`Error fetching Todo with ID ${id}:`, error.message);
      this.myLoggerService.error(`Error fetching Todo with ID ${id}`, error.stack);
      throw error;
    }
  }

  async updateStatus(id: number, status: string): Promise<Todo> {
    try {
      this.myLoggerService.log(`Updating status for Todo ID ${id}`, 'TodoService');

      const validStatuses = ['in progress', 'completed'];
      if (!validStatuses.includes(status)) {
        const errorMessage = `Invalid status "${status}" provided`;
        console.error(errorMessage);
        this.myLoggerService.error(errorMessage, 'TodoService');
        throw new BadRequestException('Invalid status. Valid statuses are "in progress" or "completed".');
      }

      const todo = await this.findOne(id);
      todo.status = status;
      const updatedTodo = await this.todoRepository.save(todo);

      this.myLoggerService.log(`Status for Todo ID ${id} updated to "${status}"`, 'TodoService');
      return updatedTodo;
    } catch (error) {
      console.error(`Error updating status for Todo ID ${id}:`, error.message);
      this.myLoggerService.error(`Error updating status for Todo ID ${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.myLoggerService.log(`Deleting Todo with ID ${id}`, 'TodoService');
      const result = await this.todoRepository.delete(id);

      if (result.affected === 0) {
        const errorMessage = `Todo with ID ${id} not found`;
        console.error(errorMessage);
        this.myLoggerService.error(errorMessage, 'TodoService');
        throw new NotFoundException(errorMessage);
      }

      this.myLoggerService.log(`Todo with ID ${id} deleted successfully`, 'TodoService');
    } catch (error) {
      console.error(`Error deleting Todo with ID ${id}:`, error.message);
      this.myLoggerService.error(`Error deleting Todo with ID ${id}`, error.stack);
      throw error;
    }
  }
}
