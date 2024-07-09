import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'user' })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: false })
  birthdate: string;

  @Prop({ required: true })
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
