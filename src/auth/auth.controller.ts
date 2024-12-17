import { Controller,Post, Body, Res, HttpStatus, ConflictException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express'; 
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { MyLoggerService } from '../my-logger/my-logger.service'; 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
  private readonly myLoggerService:MyLoggerService) {}
  
  
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

      const {accessToken} = await this.authService.login(mobile, password);
      
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 7* 24* 60* 60*1000, 
      });
      await this.myLoggerService.log(`User logged in successfully with mobile: ${mobile}`, 'AuthController');
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
      });
    } catch (error) {
      await this.myLoggerService.error('Login failed', error.stack);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: error.message || 'Login failed',
      });
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }
}