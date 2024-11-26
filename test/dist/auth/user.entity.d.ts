import { Todo } from '../todos/todo.entity';
export declare class User {
    id: number;
    name: string;
    mobile: string;
    email: string;
    hobbies: string[];
    password: string;
    todos: Todo[];
}
