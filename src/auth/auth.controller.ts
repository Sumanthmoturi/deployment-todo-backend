import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';  // Import the Response type

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    console.log("Received Registration Data:", body);
    // Call the register method and return the result
    return this.authService.register(body);
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
