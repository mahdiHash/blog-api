import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: number;

  /**
   * Id of the author.
   */
  userId: number;

  /**
   * Author of the comment.
   */
  user: User;

  /**
   * A Date() object.
   */
  date: Date;

  /**
   * Id of the post the comment is submitted to.
   */
  postId: number;

  /**
   * Post object that the comment is submitted to.
   */
  post: Post;

  /**
   * Content of the comment. Max characters count: 750.
   */
  text: string;

  /**
   * `true` if the comment is edited.
   */
  isEdited: boolean = false;

  /**
   * Id of the parent comment.
   */
  inReplyTo?: number;
}
