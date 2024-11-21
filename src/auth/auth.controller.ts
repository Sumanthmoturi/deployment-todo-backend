import { Controller, Post, Body, Res, HttpStatus, ConflictException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express'; 
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto, @Res() res: Response) {
    try {
      console.log("Received Registration Data:", body);
      const result = await this.authService.register(body);

      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'User registered successfully', user: result });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({ message: error.message });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Registration failed', error: error.message });
    }
  }
  
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.login(body.mobile, body.password);

      res.cookie('token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 3600000,
      });

      return res.status(HttpStatus.OK).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof BadRequestException) {
        if (error.message === 'Incorrect mobile number') {
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Incorrect mobile number' });
        }
        if (error.message === 'Incorrect password') {
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Incorrect password' });
        }
      }
      if (error instanceof UnprocessableEntityException) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred during login', error: error.message });
    }
  }
}
