import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'prisma/prisma.service';
import { MediaModule, MediaService } from '../media';

@Module({
  imports: [MediaModule],
  providers: [UsersResolver, UsersService, PrismaService, MediaService],
  exports: [UsersService],
})
export class UsersModule {}
