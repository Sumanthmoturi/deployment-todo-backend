import { Controller,Get,Query, Post, Body, Res, HttpStatus, ConflictException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express'; 
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { MyLoggerService } from '../my-logger/my-logger.service'; 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
  private readonly myLoggerService:MyLoggerService) {}
  
  @Get('check-email')
  async checkEmail(@Query('email') email: string, @Res() res: Response) {
    try {
      const exists = await this.authService.checkEmailExists(email);
      return res.status(HttpStatus.OK).json({ exists });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get('check-mobile')
  async checkMobile(@Query('mobile') mobile: string, @Res() res: Response) {
    try {
      const exists = await this.authService.checkMobileExists(mobile);
      return res.status(HttpStatus.OK).json({ exists });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  @Post('register')
  async register(@Body() body: RegisterUserDto, @Res() res: Response) {
    try {
      
      await this.myLoggerService.log('Registration data received', 'AuthController');
      const result = await this.authService.register(body);
       await this.myLoggerService.log(`User registered successfully with mobile: ${body.mobile}`, 'AuthController');
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'User registered successfully', user: result });
    } catch (error) {
      await this.myLoggerService.error('Registration failed', error.stack);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Registration failed',
        error: error.message,
      });
    }
  }
  
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const { mobile, password } = body;
      if (!mobile || !password) {
        throw new BadRequestException('Mobile and password are required');
      }

      const result = await this.authService.login(mobile, password);

      await this.myLoggerService.log(`User logged in successfully with mobile: ${mobile}`, 'AuthController');
      res.cookie('token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 3600000,
      });

      return res.status(HttpStatus.OK).json({ message: 'Login successful', accessToken: result.accessToken });
    } catch (error) {
      await this.myLoggerService.error('Login failed', error.stack);

      const message = error.message || 'Login failed';
      return res.status(HttpStatus.UNAUTHORIZED).json({ message });
    }
  }
}