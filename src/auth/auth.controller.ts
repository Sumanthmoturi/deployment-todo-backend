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
    try {
      // Authenticate user with mobile and password
      const result = await this.authService.login(body.mobile, body.password);
      
      if (!result || !result.accessToken) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
      }
      
      // Set the token in cookies
      res.cookie('token', result.accessToken, {
        httpOnly: true,  // Ensure JavaScript can't access this cookie
        secure: process.env.NODE_ENV === 'production', // Only set secure cookies over HTTPS
        sameSite: 'none', // Allow cookies to be sent in cross-origin requests
        maxAge: 3600000, // 1 hour expiry time
      });

      return res.status(HttpStatus.OK).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Login failed:', error);
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Login failed', error: error.message });
    }
  }
}
