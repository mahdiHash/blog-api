import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

/**
 * Authenticate user by the provided username and password.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ session: false });
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({ 
      username: username.toLowerCase(), 
      password 
    });

    if (user === null) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    return user;
  }
}
