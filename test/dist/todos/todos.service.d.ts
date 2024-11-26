import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { MyLoggerService } from '../my-logger/my-logger.service';
export declare class TodoService {
    private readonly todoRepository;
    private readonly myLoggerService;
    constructor(todoRepository: Repository<Todo>, myLoggerService: MyLoggerService);
    create(todoDto: CreateTodoDto): Promise<Todo>;
    findAll(status?: string): Promise<Todo[]>;
    findOne(id: number): Promise<Todo>;
    updateStatus(id: number, status: string): Promise<Todo>;
    remove(id: number): Promise<void>;
}
