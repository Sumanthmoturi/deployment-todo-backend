import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { MyLoggerService } from '../my-logger/my-logger.service';
export declare class AuthController {
    private authService;
    private readonly myLoggerService;
    constructor(authService: AuthService, myLoggerService: MyLoggerService);
    register(body: RegisterUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(body: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
