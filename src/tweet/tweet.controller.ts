import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
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
}
