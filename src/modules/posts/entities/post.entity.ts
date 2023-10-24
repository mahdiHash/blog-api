import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: number;

  /**
   * Title of the post.
   */
  title: string;

  /**
   * A Date() object
   */
  date: Date;

  /**
   * Content of the post.
   */
  content: string;

  /**
   * A Date() object
   */
  lastUpdate: Date;

  /**
   * The url-encoded form of title. Can be used to create a link to the post.
   */
  urlEncodedTitle: string;
}
