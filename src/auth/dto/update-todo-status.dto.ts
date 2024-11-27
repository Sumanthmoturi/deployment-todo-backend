
import { IsEnum } from 'class-validator';

export class UpdateTodoStatusDto {
  @IsEnum(['In progress', 'Completed'], {
    message: 'status must be one of the following values: In progress, Completed',
  })
  status: 'In progress' | 'Completed';
}

