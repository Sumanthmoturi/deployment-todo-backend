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

  @IsArray()
  hobbies: string[];

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
