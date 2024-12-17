import { IsNotEmpty, IsString,IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(24)
  time: number;
   
  @IsEnum(['In progress', 'Completed'], {
    message: 'status must be one of the following values: In progress, Completed',
  })
  status: 'In progress' | 'Completed';
  
}