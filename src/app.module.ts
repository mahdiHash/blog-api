import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { GraphQLError } from 'graphql';
import { AuthModule } from './modules/auth/auth.module';
import { envVariables } from './config';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    CommentsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      status400ForVariableCoercionErrors: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: envVariables.nodeEnv !== 'production',
      formatError: (err: GraphQLError) => {
        const error = {
          message: (err.extensions.originalError as Error)?.message,
          path: err.path,
        }

        return error;
      }
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
