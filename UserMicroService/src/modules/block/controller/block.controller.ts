import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { FetchUserDetailsDTO } from 'src/modules/user/DTO/userName.dto';
import { BlockService } from '../service/block.service';
import { UserIdentity } from 'src/modules/user/decorator/auth.decorator';

@Controller('users')
export class BlockController {
  constructor(private blockService: BlockService) {}

  @Post('block')
  async blockUser(
    @UserIdentity() adminUserName: { 'admin_username': string }, // custom decorator to get username of logged-in user
    @Body() fetchUserDetailsDTO: FetchUserDetailsDTO,
  ): Promise<boolean> {
    try {
      const isUserBlocked = await this.blockService.blockUserOrThrow(
        fetchUserDetailsDTO,
        adminUserName.admin_username
      );

      return isUserBlocked;
    } catch (error) {
      throw error;
    }
  }

  @Post('unblock')
  async unblockUser(
    @UserIdentity() adminUserName: { 'admin_username': string }, // custom decorator to get username of logged-in user
    @Body() fetchUserDetailsDTO: FetchUserDetailsDTO,
  ): Promise<boolean> {
    try {
      const isUserBlocked = await this.blockService.unBlockUserOrThrow(
        fetchUserDetailsDTO,
        adminUserName.admin_username
      );

      return isUserBlocked;
    } catch (error) {
      throw error;
    }
  }
}
