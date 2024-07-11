import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { DatabaseModule } from 'src/modules/database/database.module';
import { BlockModule } from 'src/modules/block/block.module';
import { CacheM } from 'src/modules/cache/cache.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    //MongooseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    BlockModule,
    DatabaseModule,
    CacheM,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
