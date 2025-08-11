import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TweetDocument = Tweet & Document;

@Schema({ timestamps: true })
export class Tweet {
  @Prop({ required: true })
  content: string;

  @Prop()
  mediaUrl?: string;

  @Prop({ required: true })
  userName: string;

}

export const TweetSchema = SchemaFactory.createForClass(Tweet);
