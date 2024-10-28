import { IsNotEmpty, IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString() // Added IsString for validation
  mobile: string;

  @IsNotEmpty()
  @IsString() // Added IsString for validation
  gender: string;

  @IsNotEmpty()
  @IsString() // Added IsString for validation
  country: string;

  @IsArray()
  @IsOptional() // Allow hobbies to be optional
  hobbies: string[]; // Ensure this is always an array

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString() // Added IsString for validation
  password: string;
}
