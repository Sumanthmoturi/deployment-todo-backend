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
      const { email, mobile } = userDto;

     
      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { mobile }],
      });

      if (existingUser) {
        if (existingUser.email === email) {
          const errorMessage=`Email already exists: ${email}`;
          console.error(errorMessage);
          this.myLoggerService.error(`Email already exists: ${email}`, 'AuthService');
          throw new ConflictException('Email already exists');
        }

        if (existingUser.mobile === mobile) {
          const errorMessage = `Mobile already exists: ${mobile}`;
          console.error(errorMessage);
          this.myLoggerService.error(`Mobile already exists: ${mobile}`, 'AuthService');
          throw new ConflictException('Mobile already exists');
        }
      }

      const hashedPassword = await bcrypt.hash(userDto.password);
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
        const errorMessage = `Incorrect mobile number: ${mobile}`;
        console.error(errorMessage);
        this.myLoggerService.error(`Incorrect mobile number: ${mobile}`, 'AuthService');
        throw new BadRequestException('Incorrect mobile number');
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        const errorMessage = `Incorrect password for mobile: ${mobile}`;
        console.error(errorMessage);
        this.myLoggerService.error(`Incorrect password attempt for mobile: ${mobile}`, 'AuthService');
        throw new BadRequestException('Incorrect password');
      }

      const payload = { userId: user.id };
      const accessToken = this.jwtService.sign(payload);
      this.myLoggerService.log(`User logged in successfully with mobile: ${mobile}`, 'AuthService');
      return { accessToken };
    } catch (error) {
      console.error('Login Error:',error.message);
      this.myLoggerService.error("Login failed", error.stack);
      throw error;
    }
  }
}
