import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../cache/service/cache.service';
import { CacheM } from '../cache/cache.module';
import { BlockModule } from '../block/block.module';
import { BlockedUsers, BlockedUsersSchema } from '../block/schema/user_blockedusersMapping.schema';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    CacheM,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        imports: [CacheM],
        useFactory: (cacheService: CacheService) => {
          const schema = UserSchema;
          schema.post('save', (data) => {
            
            const isKeyExists = cacheService.get(`${data.username}`);
            if(isKeyExists) {
              cacheService.del(`${data.username}`);
            }
            cacheService.set(`${data.username}`, data);
          });
          return schema;
        },
        inject: [CacheService]
      },
      {
        name: BlockedUsers.name,
        useFactory: () => BlockedUsersSchema
      }
    ]),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, JwtService, CacheService, UserRepository],
})
export class UserModule {}
