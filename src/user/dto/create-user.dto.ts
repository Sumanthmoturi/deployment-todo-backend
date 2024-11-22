import { IsNotEmpty, IsString, IsEmail, IsArray, IsOptional, Matches, Length } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number should be exactly 10 digits and only numbers' }) 
  mobile: string;

  @IsNotEmpty()
  @IsString() 
  gender: string;

  @IsNotEmpty()
  @IsString() 
  country: string;


  @IsOptional()
  @IsString()
  otherCountry?: string;


  @IsArray()
  @IsOptional() 
  hobbies: string[];


  @IsEmail({})
  @Matches(/^[a-zA-Z0-9._%+-]+(\+[\d]+)?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @IsNotEmpty()
  @IsString() 
  @Length(5, 20, { message: 'Password should be between 5 and 20 characters' })
  @Matches(/[A-Za-z0-9!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one special character and one number',
  })
    password: string;
}
