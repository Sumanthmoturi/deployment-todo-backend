/*
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(userDto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = this.userRepository.create({ ...userDto, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async login(mobile: string, password: string) {
    const user = await this.userRepository.findOne({ where: { mobile } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload = { userId: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
*/


import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Register a new user
  async register(userDto: RegisterUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { mobile: userDto.mobile } });
    if (existingUser) {
      throw new BadRequestException('User already exists with this mobile number');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = this.userRepository.create({ ...userDto, password: hashedPassword });
    return this.userRepository.save(user);
  }

  // Login user and return JWT if valid
  async login(mobile: string, password: string) {
    const user = await this.userRepository.findOne({ where: { mobile } });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { userId: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
