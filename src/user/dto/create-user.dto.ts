import { IsNotEmpty, IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString() 
  mobile: string;

  @IsNotEmpty()
  @IsString() 
  gender: string;

  @IsNotEmpty()
  @IsString() 
  country: string;

  @IsArray()
  @IsOptional() 
  hobbies: string[];
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString() 
  password: string;
}
