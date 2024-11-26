import { TodoService } from './todos.service';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';
import { Response } from 'express';
import { MyLoggerService } from '../my-logger/my-logger.service';
export declare class TodoController {
    private readonly todoService;
    private readonly myLoggerService;
    constructor(todoService: TodoService, myLoggerService: MyLoggerService);
    create(body: CreateTodoDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(res: Response, status?: string): Promise<Response<any, Record<string, any>>>;
    getTodoById(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatus(id: number, status: string, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteTodo(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
