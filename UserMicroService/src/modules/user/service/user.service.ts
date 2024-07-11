import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDTO } from '../DTO/user.dto';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/modules/cache/service/cache.service';
import { BlockedUsers } from 'src/modules/block/schema/user_blockedusersMapping.schema';
import { BlockService } from 'src/modules/block/service/block.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(BlockedUsers.name) private readonly blockedUsersModel: Model<BlockedUsers>,
    private jwtService: JwtService,
    private cacheService: CacheService
  ) {}

  async getUserDetailsByUserNameOrThrow(adminUser: string, username: string): Promise<{ data: User | null, src: string }> {
    try {
      const getAllUsersBlockedByAdmin = await this.blockedUsersModel.find(
        {
          username: adminUser
        },
        { 
          blockedusers: 1, _id: 0
        }
      ).exec();
      if(!getAllUsersBlockedByAdmin.length) {
        const userDetailsFromCache = await this.cacheService.get(`${username}`);
        if(!userDetailsFromCache) {
          const userDetailsFromDB = await this.userModel.findOne({
            username,
          }).exec();
          if (!userDetailsFromDB) {
            throw new NotFoundException('User not found!');
          }
          
          return { src: 'DB', data: userDetailsFromDB };
        }
        
        return { src: 'cache', data: JSON.parse(userDetailsFromCache) };
      } else {
        let userDetailsFromCache, userDetailsFromDB, src = 'cache';
        userDetailsFromCache = await this.cacheService.get(`${username}`);
        if(!userDetailsFromCache) {
          userDetailsFromDB = await this.userModel.findOne({
            username,
          }).exec();
          if (!userDetailsFromDB) {
            throw new NotFoundException('User not found!');
          }
          src = 'DB';
        }
        if(!getAllUsersBlockedByAdmin.map(i => String(i.blockedusers)).includes(userDetailsFromCache && JSON.parse(userDetailsFromCache)._id) || userDetailsFromDB && userDetailsFromDB._id) {
          return ({ src, data: userDetailsFromCache && JSON.parse(userDetailsFromCache) || userDetailsFromDB });
        }
        return ({ src, data: null });
      }
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

    return user.save();
  }

  async getUserByUserIdOrThrow(username: string): Promise<User> {
    try {
      const userDetails = await this.userModel.findOne({
        username,
      }).exec();
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
