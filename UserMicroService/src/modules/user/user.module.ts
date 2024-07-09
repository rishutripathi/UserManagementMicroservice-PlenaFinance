import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { User, UserSchema } from './schema/user.schema';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../cache/service/cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, JwtService, CacheService],
})
export class UserModule {}
