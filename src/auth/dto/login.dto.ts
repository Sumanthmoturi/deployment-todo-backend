import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits and only numbers' })
  mobile: string;
 
  @IsNotEmpty()
  @IsString() 
  @Length(5, 20, { message: 'Password should be between 5 and 20 characters' })
  @Matches(/[A-Za-z0-9!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one special character and one number',
  })
    password: string;
}
