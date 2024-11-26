import { User } from '../auth/user.entity';
export declare class Todo {
    id: number;
    name: string;
    description: string;
    time: number;
    status: string;
    user: User;
}
