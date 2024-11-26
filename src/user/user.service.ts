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

  
  async create(createUserDto: CreateUserDto): Promise<User> {
    
    const existingUser = await this.userRepository.findOne({
      where: [{ mobile: createUserDto.mobile }, { email: createUserDto.email }],
    });

    if (existingUser) {
      throw new ConflictException('Mobile or email already exists');
    }

    createUserDto.hobbies = Array.isArray(createUserDto.hobbies) 
      ? createUserDto.hobbies 
      : [createUserDto.hobbies];

    
    const userCount = await this.userRepository.count();
    createUserDto.id = userCount;

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }


  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }


  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    if (updateUserDto.mobile || updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: [{ mobile: updateUserDto.mobile }, { email: updateUserDto.email }],
      });

      if (existingUser) {
        throw new ConflictException('Mobile or email already exists');
      }
    }

 
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }


  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
 //today 
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
  
  async findByMobile(mobile: string): Promise<User> {
    return await this.userRepository.findOne({ where: { mobile } });
  }
 
}

