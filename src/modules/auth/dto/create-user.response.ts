import { User } from "../../users/entities";
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * The response you'll get from the `createUser` resolver.  
 * You need to store the `token` in `Authorization` header for the resolvers that require it.
 */
@ObjectType()
export class SignupResponse {
  /**
   * User data.
   */
  @Field()
  user: User;

  /**
   * Access token to be sent in Authorization header as a brearer token.
   */
  @Field()
  accessToken: string;
}
