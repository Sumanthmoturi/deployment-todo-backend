import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if mobile or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ mobile: createUserDto.mobile }, { email: createUserDto.email }],
    });

    if (existingUser) {
      throw new ConflictException('Mobile or email already exists');
    }

    // Ensure hobbies is always an array
    createUserDto.hobbies = Array.isArray(createUserDto.hobbies) 
      ? createUserDto.hobbies 
      : [createUserDto.hobbies];

    // Create user and set ID manually to start from 0
    const userCount = await this.userRepository.count();
    createUserDto.id = userCount;

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Get a user by ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // Update a user by ID
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    await this.findOne(id);

    // Optionally check for unique fields
    if (updateUserDto.mobile || updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: [{ mobile: updateUserDto.mobile }, { email: updateUserDto.email }],
      });

      if (existingUser) {
        throw new ConflictException('Mobile or email already exists');
      }
    }

    // Update user
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  // Delete a user by ID
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
