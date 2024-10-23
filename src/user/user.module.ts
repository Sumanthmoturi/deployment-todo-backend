import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register User repository
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Optional: If you need to use UserService in other modules
})
export class UserModule {}
