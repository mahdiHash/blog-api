import { PrismaService } from 'prisma/prisma.service';
import { hash } from 'bcryptjs';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';
import * as dto from './dto';
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
  async createUser(createUserInput: dto.CreateUserInput): Promise<User> {
    const hashedPass = await hash(createUserInput.password, 16);
    const user = await this.prisma.users.create({
      data: {
        username: createUserInput.username,
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

  update(id: number, updateUserInput: dto.UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
