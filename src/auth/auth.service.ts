import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { MyLoggerService } from '../my-logger/my-logger.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly myLoggerService: MyLoggerService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async register(userDto: RegisterUserDto) {
    try {
      const { email, mobile, password } = userDto;

      
      if (!email || !mobile || !password) {
        throw new BadRequestException('Email, mobile, and password are required');
      }

      
      const existingUser = await this.userRepository.findOne({
        where: [{email }, { mobile }],
      });

      if (existingUser) {
        if (existingUser.email === email) {
          this.myLoggerService.error(`Email already exists: ${email}`, 'AuthService');
        throw new ConflictException('Email already exists');
        }

        if (existingUser.mobile === mobile) {
          const errorMessage = `Mobile already exists: ${mobile}`;
          console.error(errorMessage);
          this.myLoggerService.error(errorMessage, 'AuthService');
          throw new ConflictException('Mobile already exists');
        }
      }

     
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(password, 10); 
      } catch (error) {
        const errorMessage = `Error hashing password for ${email || mobile}`;
        console.error(errorMessage);
        this.myLoggerService.error(errorMessage, error.stack);
        throw new BadRequestException('Error hashing password');
      }

      
      const user = this.userRepository.create({
        ...userDto,
        password: hashedPassword,
      });
      await this.userRepository.save(user);

      const successMessage = `User successfully registered with mobile: ${mobile}`;
      this.myLoggerService.log(successMessage, 'AuthService');
      return user;
    } catch (error) {
      this.myLoggerService.error('Error during registration', error.stack);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { mobile, password } = loginDto;

      if (!mobile || !password) {
        throw new BadRequestException('Mobile and password are required');
      }

      const user = await this.userRepository.findOne({ where: { mobile } });
      if (!user) {
        const errorMessage = `User with mobile number ${mobile} does not exist.`;
        this.myLoggerService.error(errorMessage, 'AuthService');
        throw new BadRequestException('User with this mobile does not exist');
      }
     
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        const errorMessage = `Incorrect password for mobile: ${mobile}`;
        console.error(errorMessage);
        this.myLoggerService.error(errorMessage, 'AuthService');
        throw new BadRequestException('Incorrect password');
      }
   
      const token = this.jwtService.sign(
        { userId: user.id },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        }
      );
      
      const successMessage = `User logged in successfully with mobile: ${mobile}`;
      this.myLoggerService.log(successMessage, 'AuthService');

      return { message: 'Login successful', user, token };
    } catch (error) {
      console.error('Login Error:', error.message);
      throw error;
    }
  }
}
