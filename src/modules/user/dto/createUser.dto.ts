import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { EmailUnique } from '../validation/emailUnique.validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail(undefined, { message: 'Invalid email' })
  @EmailUnique({ message: 'Email already in use' })
  email: string;

  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,30}$/)
  password: string;
}
