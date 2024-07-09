import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { FetchUserDetailsDTO } from 'src/modules/user/DTO/userName.dto';
import { BlockService } from '../service/block.service';
import { UserIdentity } from 'src/modules/user/decorator/auth.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('users')
//@UseInterceptors(CacheInterceptor)
export class BlockController {
  constructor(private blockService: BlockService) {}

  @Post('block')
  async blockUser(
    @UserIdentity() adminUserName: string, // custom decorator to get username of logged-in user
    @Body() fetchUserDetailsDTO: FetchUserDetailsDTO,
  ): Promise<boolean | string> {
    try {
      console.log('loggedin user?????????', adminUserName);

      const isUserBlocked = await this.blockService.blockUserOrThrow(
        fetchUserDetailsDTO,
        adminUserName,
      );
      console.log('C?', isUserBlocked);

      return isUserBlocked;
    } catch (error) {
      throw error;
    }
  }

  @Post('unblock')
  async unblockUser(
    @UserIdentity() userNameDTO: FetchUserDetailsDTO, // custom decorator to get username of logged-in user
    @Body() userDetailsDTO: FetchUserDetailsDTO,
  ): Promise<string> {
    return `User ${userDetailsDTO} unblocked successfully`;
  }
}
