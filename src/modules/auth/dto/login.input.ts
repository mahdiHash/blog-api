import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  /**
   * Username of the user
   */
  username: string;

  /**
   * Password of the user
   */
  password: string;
}
