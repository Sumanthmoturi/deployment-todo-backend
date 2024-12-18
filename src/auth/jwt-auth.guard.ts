import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'];
    
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const user = await this.jwtService.verifyAsync(token);
      request.user = user; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}