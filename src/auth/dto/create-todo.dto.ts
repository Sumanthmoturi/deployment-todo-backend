import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  description: string;

  //@IsNotEmpty()
  //time: string;
  @IsNotEmpty()
  @IsString() 
  time?: string;

  status: string;
}