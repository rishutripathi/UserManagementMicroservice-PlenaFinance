import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { FetchUserDetailsDTO } from '../DTO/userName.dto';
import { UserDTO } from '../DTO/user.dto';
import { User } from '../schema/user.schema';
import { UserIdentity } from '../decorator/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('search/user/:username')
  async getUserByUserName(
    @UserIdentity() userNameDTO: { 'admin_userName': string }, // custom decorator to get username of logged-in user
    @Param() userDetailsDto: FetchUserDetailsDTO,
  ): Promise<{ data: User, src: string }> {
    const { username } = userDetailsDto;
    const { admin_userName } = userNameDTO;
    
    return this.userService.getUserDetailsByUserNameOrThrow(admin_userName, username.trim());
  }

  @Get('search/age/:minage-:maxage')
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
  async createUser(@Body() userDTO: UserDTO): Promise<User> {
    const user = await this.userService.createUser(userDTO);

    return user;
  }

  @Post('login')
  async login(
    @Body() authenticationDTO: FetchUserDetailsDTO,
  ): Promise<{ token: string }> {

    const { username } = authenticationDTO;
    const userService = await this.userService.generateUserTokenByUserName(
      username.trim(),
    );

    return userService;
  }
}
