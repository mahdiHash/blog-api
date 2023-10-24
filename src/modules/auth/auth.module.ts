import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy, AccessJwtStrategy, RefreshJwtStrategy } from './strategies';
import { envVariables } from 'src/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: envVariables.jwtSecret,
    }),
  ],
  providers: [AuthResolver, AuthService, LocalStrategy, AccessJwtStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
