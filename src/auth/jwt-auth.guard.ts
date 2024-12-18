import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'];
    
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}