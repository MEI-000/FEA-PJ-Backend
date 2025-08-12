import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tweet, TweetDocument } from './tweet.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { Model } from 'mongoose';

@Injectable()
export class TweetService {
  private readonly logger = new Logger(TweetService.name);

    constructor(
        @InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>,
        private notificationsService: NotificationsService,
    ) {}

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

    async findById(tweetId: string): Promise<Tweet> {
        try {
            const tweet = await this.tweetModel.findById(tweetId);
            if (!tweet) throw new NotFoundException('Tweet not found');
            return tweet;
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

    async like(tweetId: string, actionUserName: string) {
        const tweet = await this.tweetModel.findById(tweetId);
        if (!tweet) throw new NotFoundException('Tweet not found');

        // toggle like
        const idx = tweet.likes.indexOf(actionUserName);
        if (idx === -1) {
        tweet.likes.push(actionUserName);
        await tweet.save();
        // send notification to author if liker != author
        if (tweet.userName !== actionUserName) {
            await this.notificationsService.create(tweet.userName, actionUserName, 'like', tweet._id.toString());
        }
        } else {
        tweet.likes.splice(idx, 1);
        await tweet.save();
        }

        return tweet;
    }

    async retweet(tweetId: string, actionUserId: string, actionUserName: string) {
        const original = await this.tweetModel.findById(tweetId);
        if (!original) throw new NotFoundException('Tweet not found');

        const retweet = new this.tweetModel({
        userId: actionUserId,
        userName: actionUserName,
        content: original.content,
        originalTweetId: original._id,
        mediaUrl: original.mediaUrl || null,
        });
        await retweet.save();

        original.retweetCount = (original.retweetCount || 0) + 1;
        await original.save();

        if (original.userName !== actionUserName) {
        await this.notificationsService.create(original.userName, actionUserName, 'retweet', original._id.toString());
        }

        return retweet;
    }

}
