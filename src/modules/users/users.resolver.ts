import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput } from './dto';
import { CurrentUser } from 'src/common/decorators';
import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GqlAccessJwtAuthGuard } from 'src/modules/auth/guards';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return await this.usersService.createUser(createUserInput);
  }

  @UseGuards(GqlAccessJwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Query(() => User, { name: 'user', description: 'Get current logged in user data' })
  async getCurrentUser(@CurrentUser() user: User): Promise<User> {
    return plainToClass(User, user);
  }

  @Query(() => User, { name: 'userById' })
  async getUserById(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return await this.usersService.getUser(id);
  }

  @Query(() => User, { name: 'userByUsername' })
  getUserByUsername(@Args('username') username: number) {
    return this.usersService.getUser(username);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
