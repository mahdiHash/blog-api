import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { envVariables } from '../../../config/environment.config';
import { IJwtPayload } from '../dto';
import { UsersService } from 'src/modules/users';
import { User } from 'src/modules/users/entities';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'accessJwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envVariables.jwtSecret,
    })
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const user = await this.usersService.getUser(payload.sub, false);

    return user;
  }
}
