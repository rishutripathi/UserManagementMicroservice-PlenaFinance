import * as moment from 'moment-timezone';
import { Schema, Document, Model } from 'mongoose';
import mongoose from 'mongoose';

export interface BaseEntityDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

const BaseEntitySchema: Schema<BaseEntityDocument> = new Schema(
  {
    // Other fields can be added here
  },
  {
    timestamps: true, // Mongoose built-in timestamps
  },
);

BaseEntitySchema.pre<BaseEntityDocument>(
  'save',
  function (this: BaseEntityDocument, next) {
    const now = moment().tz('GMT', true).toDate();
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
    next();
  },
);

export const BaseEntityModel: Model<BaseEntityDocument> =
  mongoose.model<BaseEntityDocument>('BaseEntity', BaseEntitySchema);
