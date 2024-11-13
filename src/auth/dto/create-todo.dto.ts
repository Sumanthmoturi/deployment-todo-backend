import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  time: number;
   
  @IsNotEmpty()
  status: string;
}