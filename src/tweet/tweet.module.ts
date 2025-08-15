import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { Tweet, TweetSchema } from './tweet.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { TweetGateway } from './tweet.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]), NotificationsModule],
  providers: [TweetService, TweetGateway],
  controllers: [TweetController]
})
export class TweetModule {}
