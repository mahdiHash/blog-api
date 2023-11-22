import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto';
import { CurrentUser } from 'src/common/decorators';
import { plainToClass } from 'class-transformer';
import { GqlAccessJwtAuthGuard } from 'src/modules/auth/guards';
import { MediaService } from '../media';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private mediaService: MediaService,
  ) {}

  @UseGuards(GqlAccessJwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Query(() => User, { name: 'user', description: "Get current logged in user's data." })
  async getCurrentUser(@CurrentUser() user: User): Promise<User> {
    return plainToClass(User, user);
  }

  @Query(() => User, { name: 'userById' })
  async getUserById(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return await this.usersService.getUser(id);
  }

  @Query(() => User, { name: 'userByUsername' })
  getUserByUsername(@Args('username') username: string) {
    return this.usersService.getUser(username);
  }

  @UseGuards(GqlAccessJwtAuthGuard)
  @Mutation(() => User, { description: "Update user's data." })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    if (updateUserInput.username !== user.username) {
      const duplicateUsername = await this.usersService.getUser(updateUserInput.username);

      if (duplicateUsername) {
        throw new BadRequestException('Username is already taken. Please choose another one.');
      }
    }

    return await this.usersService.update(user.id, updateUserInput);
  }

  @UseGuards(GqlAccessJwtAuthGuard)
  @Mutation(() => User, {
    description: "Remove the current user's profile.",
  })
  async removeUser(@CurrentUser() { id, profilePicUrl }: User): Promise<User> {
    const [removedUser] = await Promise.all([
      this.usersService.remove(id),

      // Remove the user's profile picture from local storage if it exists
      profilePicUrl
        ? this.mediaService.removeFile(profilePicUrl.replace('/media/', ''))
        : Promise.resolve(),
    ]);

    return removedUser;
  }
}
