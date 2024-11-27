import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';
import { IsEnum } from 'class-validator';

export class UpdateTodoStatusDto extends PartialType(RegisterUserDto) {
  @IsEnum(['In progress', 'Completed'], {
    message: 'status must be one of the following values: In progress, Completed',
  })
  status: 'In progress' | 'Completed';
}

