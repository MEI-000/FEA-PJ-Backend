// src/notifications/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document & {
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationType = 'follow' | 'like' | 'retweet';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  type: NotificationType;

  @Prop({ type: Types.ObjectId, ref: 'Tweet', default: null })
  tweetId: Types.ObjectId | null;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
