import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tweet, TweetDocument } from './tweet.schema';
import { Model } from 'mongoose';

@Injectable()
export class TweetService {
  private readonly logger = new Logger(TweetService.name);

  constructor(@InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>) {}

  async create(content: string, mediaUrl: string | null, userName: string): Promise<Tweet> {
    try {
      const tweet = new this.tweetModel({ content, mediaUrl, userName });
      return await tweet.save();
    } catch (error) {
      this.logger.error(`Failed to create tweet: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create tweet');
    }
  }

  async findAll(): Promise<Tweet[]> {
    try {
      return await this.tweetModel.find().sort({ createdAt: -1 }).exec();
    } catch (error) {
      this.logger.error(`Failed to retrieve tweets: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve tweets');
    }
  }

  async getTweetsByUser(userName: string): Promise<Tweet[]> {
  try {
    return await this.tweetModel
      .find({ userName }) 
      .sort({ createdAt: -1 })
      .exec();
  } catch (error) {
    this.logger.error(`Failed to retrieve tweets for user ${userName}: ${error.message}`, error.stack);
    throw new InternalServerErrorException('Failed to retrieve tweets');
  }
}
}
