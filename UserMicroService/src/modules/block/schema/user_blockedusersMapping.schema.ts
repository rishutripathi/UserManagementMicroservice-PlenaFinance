import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'user_blockedusersMapping',
  autoIndex: process.env.ENVIROMENT == 'development',
})
export class BlockedUsers extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  blockedusers: Types.ObjectId[];
}

export const BlockedUsersSchema = SchemaFactory.createForClass(BlockedUsers);
BlockedUsersSchema.index(
  { username: 1, blockedusers: 1, createdAt: 1 },
  { unique: true },
); // compound index
