import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type TweetDocument = Tweet & Document & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Tweet {
  @Prop({ required: true })
  content: string;

  @Prop()
  mediaUrl?: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ default: [] })
  likes: string[];

  @Prop({ default: 0 })
  retweetCount: number;

  @Prop({ type: Types.ObjectId, ref: 'Tweet', default: null })
  originalTweetId: Types.ObjectId | null;

}

export const TweetSchema = SchemaFactory.createForClass(Tweet);
