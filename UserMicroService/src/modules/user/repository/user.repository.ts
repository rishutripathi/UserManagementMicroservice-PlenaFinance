import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schema/user.schema";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async getAllUsers(): Promise<User[]> {
        
        return this.userModel.find();
    }

    async getUserByUsername(username: string): Promise<User> {
        const user = await this.userModel.findOne({
            username
        });

        return user;
    }

    async getUserById(_id: string): Promise<User> {
        const user = await this.userModel.findOne({
            _id
        });

        return user;
    }
}