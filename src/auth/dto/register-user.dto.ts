import { IsEmail, IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsArray()
  hobbies: string[]; // Change to `hobbies: string[];` if you require hobbies to be present

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
