import { PrismaService } from '../../../prisma/prisma.service';
import { hash } from 'bcryptjs';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';
import * as dto from './dto';
import { SignupInput } from '../auth/dto';
import {
  ClassSerializerInterceptor,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new user record in db.
   *
   * @param createUserInput
   * @returns created user object
   */
  @UseInterceptors(ClassSerializerInterceptor)
  async createUser(createUserInput: SignupInput): Promise<User> {
    const hashedPass = await hash(createUserInput.password, 16);
    const user = await this.prisma.users.create({
      data: {
        username: createUserInput.username.toLowerCase(),
        password: hashedPass,
        role: 'USER',
        lastLoginDate: new Date(),
      },
    });

    return plainToClass(User, user);
  }

  /**
   * Get a user's data with its username.
   * 
   * @param username username to look up the user with
   * @returns The user's data
   */
  async getUser(username: string, hideSensitiveFields?: boolean): Promise<User>;

  /**
   * Get a user's data with its id.
   * 
   * @param id user's id to look up
   * @returns The user's data
   */
  async getUser(id: number, hideSensitiveFields?: boolean): Promise<User>;

  @UseInterceptors(ClassSerializerInterceptor)
  async getUser(
    lookUpField: string | number,
    hideSensitiveFields = true,
  ): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where:
        typeof lookUpField === 'number'
          ? { id: lookUpField }
          : { username: lookUpField },
    });

    if (user === null) {
      throw new NotFoundException('user not found');
    }

    return hideSensitiveFields ? plainToClass(User, user) : user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  async update(id: number, updateUserInput: dto.UpdateUserInput, hideSensitiveFields = true): Promise<User> {
    const hashedPass = updateUserInput.password ? await hash(updateUserInput.password, 16) : undefined;
    const user = await this.prisma.users.update({
      where: { id },
      data: {
        username: updateUserInput.username,
        password: hashedPass,
      },
    });

    return hideSensitiveFields ? plainToClass(User, user) : user;
  }

  /**
   * 
   * @param id - User's id to remove.
   * @param hideSensitiveFields - Hide the feilds that should not be exposed, e.g. `password`.
   * @returns The removed user's data.
   */
  async remove(id: number, hideSensitiveFields = true): Promise<User> {
    const user = this.prisma.users.delete({
      where: { id },
    });

    return hideSensitiveFields ? plainToClass(User, user) : user;
  }
}
