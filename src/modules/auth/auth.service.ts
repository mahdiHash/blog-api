import { LoginInput } from './dto/login.input';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate a user's authentication using a username and a password.
   * 
   * @param credentials Login input containing a `username` and a `password`.
   * @returns User object if the validation is successful, otherwise it's null
   */
  async validateUser(credentials: LoginInput): Promise<User | null> {
    const { username, password } = credentials;
    const user = await this.userService.getUser(username, false);
    const doesPassMatch = await compare(password, user.password);

    if (!doesPassMatch) {
      return null;
    }

    return user;
  }

  /**
   * This service generates a refresh token from the given user object.  
   * The token is valid for 90 days.
   * 
   * @param user - User object to make a jwt from
   * @returns The generated refresh token
   */
  generateRefreshToken(user: User): string {
    const token = this.jwtService.sign(
      { username: user.username, sub: user.id },
      { expiresIn: '90d' },
    );

    return token;
  }

  /**
   * This service generates an access token from the given user object.  
   * The token is valid for 5 minutes.
   * 
   * @param user User object to generate an access token from
   * @returns The generated access token
   */
  generateAccessToken(user: User): string {
    const token = this.jwtService.sign(
      { username: user.username, sub: user.id },
      { expiresIn: '5m' },
    );

    return token;
  }
}
