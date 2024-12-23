
import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoStatusDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(24)
  time?: number;

  @IsOptional()
  @IsEnum(['In progress', 'Completed'])
  status?: 'In progress' | 'Completed';
}
