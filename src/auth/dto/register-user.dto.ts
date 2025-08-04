// dto/register-user.dto.ts
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  @Length(3, 20, { message: 'Username must be 3-20 characters' })
  username: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 32, { message: 'Password must be 6-32 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/, {
    message:
      'Password must contain uppercase, lowercase letters and numbers, and no special characters',
  })
  password: string;
}