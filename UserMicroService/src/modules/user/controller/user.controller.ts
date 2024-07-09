import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { FetchUserDetailsDTO } from '../DTO/userName.dto';
import { UserDTO } from '../DTO/user.dto';
import { User } from '../schema/user.schema';
import { UserIdentity } from '../decorator/auth.decorator';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('users')
//@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('search/user/:username')
  //@CacheKey('users')
  async getUserByUserName(
    @UserIdentity() userNameDTO: FetchUserDetailsDTO, // custom decorator to get username of logged-in user
    @Param() userDetailsDto: FetchUserDetailsDTO,
  ): Promise<{ data: User, src: string }> {    
    const { username } = userDetailsDto;
    
    return this.userService.getUserDetailsByUserNameOrThrow(username.trim());
  }

  @Get('search/age/:minage-:maxage')
  //@CacheKey('users')
  async getUserByMin_MaxAge(
    @UserIdentity() userNameDTO: FetchUserDetailsDTO, // custom decorator to get username of logged-in user
    @Param('minage', ParseIntPipe) minage: number,
    @Param('maxage', ParseIntPipe) maxage: number,
  ): Promise<User[]> {
    return this.userService.getUserDetailsByMinAndOrMaxAgeOrThrow(
      minage,
      maxage,
    );
  }

  @Post()
  //@CacheKey('users')
  async createUser(@Body() userDTO: UserDTO): Promise<User> {
    console.log('user dto', userDTO);
    const user = await this.userService.createUser(userDTO);

    return user;
  }

  @Post('login')
  async login(
    @Body() authenticationDTO: FetchUserDetailsDTO,
  ): Promise<{ token: string }> {
    console.log('autho dto', authenticationDTO);

    const { username } = authenticationDTO;
    const userService = await this.userService.generateUserTokenByUserName(
      username.trim(),
    );

    return userService;
  }
}
