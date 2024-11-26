import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { MyLoggerService } from '../my-logger/my-logger.service';
export declare class AuthService {
    private jwtService;
    private readonly myLoggerService;
    private userRepository;
    constructor(jwtService: JwtService, myLoggerService: MyLoggerService, userRepository: Repository<User>);
    register(userDto: RegisterUserDto): Promise<User>;
    login(mobile: string, password: string): Promise<{
        accessToken: string;
    }>;
}
