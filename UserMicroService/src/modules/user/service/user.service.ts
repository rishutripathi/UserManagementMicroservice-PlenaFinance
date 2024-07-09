import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDTO } from '../DTO/user.dto';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/modules/cache/service/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private cacheService: CacheService
  ) {}

  async getUserDetailsByUserNameOrThrow(username: string): Promise<{ data: User, src: string }> {
    try {
      console.log("here?????????", username);
      
      const userDetailsFromCache = await this.cacheService.get(`username: ${username}`);
      console.log("cache-", userDetailsFromCache);
      
      if(!userDetailsFromCache) {
        const userDetailsFromDB = await this.userModel.findOne({
          username,
        });
        if (!userDetailsFromDB) {
          throw new NotFoundException('User not found!');
        }
        console.log("db-", userDetailsFromDB);
        
        return { src: 'DB', data: userDetailsFromDB };;
      }
      
      return { src: 'cache', data: JSON.parse(userDetailsFromCache) };
    } catch (error) {
      throw error;
    }
  }

  async getUserDetailsByMinAndOrMaxAgeOrThrow(
    minage: number,
    maxage: number,
  ): Promise<User[]> {
    try {
      const usersDetails = await this.userModel.find({
        age: { $gte: minage, $lte: maxage },
      });
      if (!usersDetails.length) {
        throw new NotFoundException(
          `No user's age exists between ${minage} & ${maxage}`,
        );
      }

      return usersDetails;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userDTO: UserDTO): Promise<User> {
    const user = new this.userModel(userDTO);
    console.log('created?', user);
    await this.cacheService.set('username: '+user.username, user);
    return user.save();
  }

  async getUserByUserIdOrThrow(username: string): Promise<User> {
    try {
      console.log('username in user service:->', username);
      const userDetails = await this.userModel.findOne({
        username,
      });
      if (!userDetails) {
        throw new NotFoundException('User not found!');
      }

      return userDetails;
    } catch (error) {
      throw error;
    }
  }

  async generateUserTokenByUserName(
    username: string,
  ): Promise<{ token: string }> {
    try {
      const jwtPayload = {
        username,
      };
      const token = await this.jwtService.signAsync(jwtPayload, {
        secret: 'ABC1234',
      });

      return { token };
    } catch (error) {
      throw error;
    }
  }
}
