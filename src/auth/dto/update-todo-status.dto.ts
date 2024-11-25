import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateTodoStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['in progress', 'completed'])
  status: string;
}