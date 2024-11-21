import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits and only numbers' })
  mobile: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })  // Adjust length as per your requirements
  password: string;
}
