import { Resolver, Mutation, Context, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login.response';
import { UseGuards } from '@nestjs/common';
import { GqlLocalAuthGuard } from './guards/gql-local.guard';
import { LoginInput } from './dto/login.input';
import { envVariables } from 'src/config';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse, {
    description:
      'Use this resolver to get an access token and user object if the credentials you provided are correct.',
  })
  @UseGuards(GqlLocalAuthGuard)
  async login(@Context() ctx, @Args('loginInput') input: LoginInput): Promise<LoginResponse> {
    const { req: { res }, user } = ctx;
    const refreshToken = this.authService.generateRefreshToken(user);
    const accessToken = this.authService.generateAccessToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      signed: true,
      secure: envVariables.nodeEnv === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    });

    return {
      accessToken,
      user,
    };
  }

  @Query(() => String, { description: 'Get an access token when a user is logged in.' })
  getAccessToken(@Context() ctx): string {
    const { user } = ctx;
    const accessToken = this.authService.generateAccessToken(user);

    return accessToken;
  }
}
