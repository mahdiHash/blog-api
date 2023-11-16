import { Resolver, Mutation, Context, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login.response';
import { UseGuards } from '@nestjs/common';
import { GqlLocalAuthGuard } from './guards/gql-local.guard';
import { LoginInput } from './dto/login.input';
import { envVariables } from 'src/config';
import { GqlRefreshJwtAuthGuard } from './guards';
import { SignupInput, SignupResponse } from './dto';
import { UsersService } from '../users';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => SignupResponse, {
    description: 'You can create a new user record with this resolver. You\'ll be given an access token and user\'s data.'
  })
  async signup(@Args('signupInput') singupInput: SignupInput): Promise<SignupResponse> {
    const user = await this.usersService.createUser(singupInput);
    const token = this.authService.generateAccessToken(user);

    return {
      accessToken: token,
      user,
    };
  }

  @Mutation(() => LoginResponse, {
    description:
      'Use this resolver to get an access token and user data if the credentials you provided are correct.',
  })
  @UseGuards(GqlLocalAuthGuard)
  async login(@Context() ctx, @Args('loginInput') input: LoginInput): Promise<LoginResponse> {
    const {
      req: { res },
      user,
    } = ctx;
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

  @UseGuards(GqlRefreshJwtAuthGuard)
  @Query(() => String, { description: 'Get an access token when a user is logged in.' })
  getAccessToken(@Context() ctx): string {
    const {
      req: { user },
    } = ctx;
    const accessToken = this.authService.generateAccessToken(user);

    return accessToken;
  }

  @UseGuards(GqlRefreshJwtAuthGuard)
  @Mutation(() => String, { description: 'Logout of user account.' })
  logout(@Context() ctx): boolean {
    const {
      req: { res },
    } = ctx;

    res.clearCookie('refreshToken', {
      httpOnly: true,
      signed: true,
      secure: envVariables.nodeEnv === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    });

    return true;
  }
}
