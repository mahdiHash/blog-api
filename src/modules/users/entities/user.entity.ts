import { ObjectType, Field, ID, HideField, registerEnumType } from '@nestjs/graphql';
import { UserRoles, users } from '@prisma/client';
import { Exclude } from 'class-transformer';

registerEnumType(UserRoles, {
  name: 'UserRoles',
});

@ObjectType()
export class User implements users {
  @Field(() => ID)
  id: number;

  /**
   * Username of the user. 
   */
  @Field()
  username: string;
  
  /**
   * Role of the user. Can be either "USER" or "ADMIN".
   */
  @Field(() => UserRoles)
  role: UserRoles;

  /**
   * When the user signed up in Timestamp format
   */
  @Field()
  joinDate: Date;
  
  /**
   * Relative path to user's profile pic e.g. "/img/path/to/image.jpg".
   */
  @Field({ nullable: true })
  profilePicUrl: string | null;

  /**
   * Last time the user has logged in on a device
   */
  @Exclude()
  @HideField()
  lastLoginDate: Date;
  
  /**
   * User's hashed password.
   */
  @Exclude()
  @HideField()
  password: string;
}
