import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/service/user.service';
import { BlockedUsers } from '../schema/user_blockedusersMapping.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FetchUserDetailsDTO } from 'src/modules/user/DTO/userName.dto';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(BlockedUsers.name)
    private blockedUsersModel: Model<BlockedUsers>,
    private readonly userService: UserService,
  ) {}

  async blockUserOrThrow(
    fetchUserDetailsDTO: FetchUserDetailsDTO,
    adminUserName: string,
  ): Promise<boolean> {
    try {
      const { username } = fetchUserDetailsDTO;
      const isUserExists = await this.userService.getUserByUserIdOrThrow(
        username.trim(),
      );
      const newModel = new this.blockedUsersModel({
        username: adminUserName,
        blockedusers: isUserExists._id,
      });

      await newModel.save();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
