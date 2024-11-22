import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { MyLoggerService } from '../my-logger/my-logger.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly myLoggerService: MyLoggerService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(userDto: RegisterUserDto) {
    try {
      const { email, mobile, password } = userDto;

      // Ensure that email, mobile, and password are provided
      if (!email || !mobile || !password) {
        throw new BadRequestException('Email, mobile, and password are required');
      }

      // Check for existing user by email or mobile
      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { mobile }],
      });

      if (existingUser) {
        if (existingUser.email === email) {
          const errorMessage = `Email already exists: ${email}`;
          console.error(errorMessage);
          this.myLoggerService.error(errorMessage, 'AuthService');
          throw new ConflictException('Email already exists');
        }

        if (existingUser.mobile === mobile) {
          const errorMessage = `Mobile already exists: ${mobile}`;
          console.error(errorMessage);
          this.myLoggerService.error(errorMessage, 'AuthService');
          throw new ConflictException('Mobile already exists');
        }
      }

      // Hash password with salt rounds (default to 10 rounds)
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(password, 10); 
      } catch (error) {
        const errorMessage = `Error hashing password for ${email || mobile}`;
        console.error(errorMessage);
        this.myLoggerService.error(errorMessage, error.stack);
        throw new BadRequestException('Error hashing password');
      }

      // Create the new user and save to database
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

  async login(mobile: string, password: string) {
    try {
      // Check if the user exists by mobile number
      const user = await this.userRepository.findOne({ where: { mobile } });

      if (!user) {
        const errorMessage = `Incorrect mobile number: ${mobile}`;
        console.error(errorMessage);
        this.myLoggerService.error(errorMessage, 'AuthService');
        throw new BadRequestException('Incorrect mobile number');
      }

      // Check if the password matches
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        const errorMessage = `Incorrect password for mobile: ${mobile}`;
        console.error(errorMessage);
        this.myLoggerService.error(errorMessage, 'AuthService');
        throw new BadRequestException('Incorrect password');
      }

      // Generate JWT token if credentials are valid
      const payload = { userId: user.id };
      const accessToken = this.jwtService.sign(payload);

      const successMessage = `User logged in successfully with mobile: ${mobile}`;
      this.myLoggerService.log(successMessage, 'AuthService');
      return { accessToken };
    } catch (error) {
      console.error('Login Error:', error.message);
      this.myLoggerService.error('Login failed', error.stack);
      throw error;
    }
  }
}
