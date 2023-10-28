import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { envVariables } from '../../../config/environment.config';
import { IJwtPayload } from '../dto';
import { UsersService } from 'src/modules/users';
import { User } from 'src/modules/users/entities';
import { extractJwtFromCookie } from '../auth.helper';

/**
 * Extracts and validates the refresh token from cookie.
 */
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refreshJwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: envVariables.jwtSecret,
    })
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const user = await this.usersService.getUser(payload.sub, false);

    return user;
  }
}
