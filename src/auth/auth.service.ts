import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { MyLoggerService } from '../my-logger/my-logger.service';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly myLoggerService: MyLoggerService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(userDto: RegisterUserDto) {
    try {
      const { email, mobile } = userDto;

  
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobile)) {
        this.myLoggerService.error(`Invalid mobile format: ${mobile}`, 'AuthService');
        throw new BadRequestException('Mobile number must be exactly 10 digits');
      }

     
      const errors = await validate(userDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => {
          return `${error.property}: ${Object.values(error.constraints).join(', ')}`;
        }).join(' | ');

        this.myLoggerService.error(`Validation failed: ${errorMessages}`, 'AuthService');
        throw new BadRequestException(`Validation failed: ${errorMessages}`);
      }


      const emailExists = await this.userRepository.findOne({ where: { email } });
      if (emailExists) {
        this.myLoggerService.error(`Email already exists: ${email}`, 'AuthService');
        throw new ConflictException('Email already exists');
      }

      const mobileExists = await this.userRepository.findOne({ where: { mobile } });
      if (mobileExists) {
        this.myLoggerService.error(`Mobile already exists: ${mobile}`, 'AuthService');
        throw new ConflictException('Mobile already exists');
      }

      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const user = this.userRepository.create({
        ...userDto,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      this.myLoggerService.log(`User successfully registered with mobile: ${mobile}`, 'AuthService');
      return user;
    } catch (error) {
      this.myLoggerService.error('Error during registration', error.stack);
      throw error;
    }
  }

  async login(mobile: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ where: { mobile } });

      if (!user) {
        this.myLoggerService.error(`Incorrect mobile number: ${mobile}`, 'AuthService');
        throw new BadRequestException('Incorrect mobile number');
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        this.myLoggerService.error(`Incorrect password attempt for mobile: ${mobile}`, 'AuthService');
        throw new BadRequestException('Incorrect password');
      }

      const payload = { userId: user.id };
      const accessToken = this.jwtService.sign(payload);
      this.myLoggerService.log(`User logged in successfully with mobile: ${mobile}`, 'AuthService');
      
      return { accessToken };
    } catch (error) {
      this.myLoggerService.error("Login failed", error.stack);
      throw error;
    }
  }
}
