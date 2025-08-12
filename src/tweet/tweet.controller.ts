import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Param,
  Body,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('tweets')
export class TweetController {

    constructor(private readonly tweetsService: TweetService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueName + extname(file.originalname));
            },
        }),
        }),
    )
    async create(@UploadedFile() file: Express.Multer.File, @Body() body, @Req() req) {
        const mediaUrl = file ? `/uploads/${file.filename}` : null;
        return this.tweetsService.create(body.content, mediaUrl, req.user.username);
    }

    @Get()
    async getTweets() {
        return this.tweetsService.findAll();
    }

    @Get('mine')
    @UseGuards(JwtAuthGuard)
    getOwnTweets(@Req() req) {
        return this.tweetsService.getTweetsByUser(req.user.username);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getTweetById(@Param('id') id: string) {
        return this.tweetsService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/like')
    async like(@Param('id') id: string, @Req() req) {
        return this.tweetsService.like(id, req.user.username);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/retweet')
    async retweet(@Param('id') id: string, @Req() req) {
        return this.tweetsService.retweet(id, req.user.userId, req.user.username);
    }
}
