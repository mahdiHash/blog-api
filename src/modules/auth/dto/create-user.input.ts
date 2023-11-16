import { InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsString, MinLength } from 'class-validator';
import { Match, IsUsernameTaken } from '../../../common/decorators';

@InputType()
export class SignupInput {
  /**
   * Username must:  
   * 1- be a string  
   * 2- contain at least 3 characters  
   * 3- be alphanumeric
   */
  @IsString({ message: 'username must be a string' })
  @MinLength(3, { message: 'username must contain at least 3 characters' })
  @IsAlphanumeric('en-US', { message: 'username must be alphanumeric' })
  @IsUsernameTaken({ message: 'Username is already taken. Please choose another one.' })
  username: string;

  /**
   * Password must:  
   * 1- be a string  
   * 2- contain at least 8 characters  
   */
  @IsString({ message: 'password must be a string' })
  @MinLength(8, { message: 'password must contain at least 8 characters' })
  password: string;

  /**
   * This field must be equal to `password` field
   */
  @Match('password', { message: "Password doesn't match" })
  passwordRepeat: string;
}
