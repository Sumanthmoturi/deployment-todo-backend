import { IsEmail, IsNotEmpty, IsString, IsArray, Matches, Length } from 'class-validator';

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

  @IsEmail({})
  @Matches(/^[a-zA-Z0-9._%+-]+(\+[\d]+)?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @IsNotEmpty()
  @IsString() 
  @Length(5, 20, { message: 'Password should be between 5 and 20 characters' })
  password: string;
}
