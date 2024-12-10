import { IsEmail, IsNotEmpty, IsString, IsArray, Matches, Length, IsOptional } from 'class-validator';

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

  @IsOptional()
  @IsString()
  otherCountry?: string;

  @IsArray()
  hobbies: string[];

  @IsOptional() // Mark as optional to allow empty values
  @IsString()
  otherHobby?: string;

  @IsEmail({})
  @Matches(/^[a-zA-Z0-9._%+-]+(\+[\d]+)?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @IsNotEmpty()
  @IsString() 
  @Length(5, 20, { message: 'Password should be between 5 and 20 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,20}$/, {
    message: 'Password must be between 5 and 20 characters, contain at least one letter, one number, and one special character',
  })
    password: string;
}
