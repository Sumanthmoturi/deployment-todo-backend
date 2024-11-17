import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';  // Import the Response type

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any, @Res() res: Response) {
    try {
      console.log("Received Registration Data:", body);
      const result = await this.authService.register(body);  // Handle registration logic

  
      return res.status(HttpStatus.CREATED).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration failed:', error);
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Registration failed', error: error.message });
    }
  }

  @Post('login')
  async login(@Body() body: { mobile: string; password: string }, @Res() res: Response) {
    
    const result = await this.authService.login(body.mobile, body.password);

    
    res.cookie('token', result.accessToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', // Only set secure cookies over HTTPS
      sameSite: 'none',
      maxAge: 3600000, 
    });
    

  
    return res.status(HttpStatus.OK).json({ message: 'Login successful' });
  }
}
