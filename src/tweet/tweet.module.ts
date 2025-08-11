import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { Tweet, TweetSchema } from './tweet.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }])],
  providers: [TweetService],
  controllers: [TweetController]
})
export class TweetModule {}
