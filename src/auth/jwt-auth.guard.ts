import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    let token = authHeader ? authHeader.split(' ')[1] : null;
    if (!token) {
      token = request.cookies['access_token'];
    }
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = { userId: decoded.sub };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
