import { Module } from '@nestjs/common';
import { BlockController } from './controller/block.controller';
import { BlockService } from './service/block.service';
import {
  BlockedUsers,
  BlockedUsersSchema,
} from './schema/user_blockedusersMapping.schema';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlockedUsers.name,
        schema: BlockedUsersSchema,
      },
    ]),
    UserModule,
  ],
  exports: [],
  controllers: [BlockController],
  providers: [BlockService],
})
export class BlockModule {}
