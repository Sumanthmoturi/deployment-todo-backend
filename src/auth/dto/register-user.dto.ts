/*
import { IsNotEmpty, IsString, IsEmail, IsArray } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  country: string;

  @IsArray()
  hobbies: string[];

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

*/


// register-user.dto.ts
import { IsString, IsEmail, IsMobilePhone, IsArray } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsMobilePhone() // Validates the mobile number format
  mobile: string;

  @IsString()
  gender: string;

  @IsString()
  country: string;

  @IsArray() // Ensures hobbies is an array
  hobbies: string[];

  @IsEmail() // Validates the email format
  email: string;

  @IsString()
  password: string;
}
