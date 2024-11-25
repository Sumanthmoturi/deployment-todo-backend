import { IsNotEmpty, IsString, IsNumber, IsIn, Min, Max } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(24)
  time: number;
   
  @IsNotEmpty()
  @IsString()
  @IsIn(['In progress', 'Completed'], {
  message: 'status must be one of the following values: In progress, Completed',
  })
  status: string;
}