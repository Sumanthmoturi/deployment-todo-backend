import { IsEmail, IsNotEmpty, IsString, IsArray, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile must be 10 digits' })
  mobile: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  country: string;

  @IsArray()
  hobbies: string[];

  @IsEmail({}, {message:"invalid email address format"})
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
