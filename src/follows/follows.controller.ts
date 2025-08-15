import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { ListQueryDto } from './dto/list.dto';

// Use your Member B auth
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from 'src/auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller()
export class FollowsController {
  constructor(private follows: FollowsService) {}

  @Post('follow/:userId')
  follow(@Param('userId') userId: string, @CurrentUser('id') me: string) {
    return this.follows.follow(userId, me);
  }

  @Delete('follow/:userId')
  unfollow(@Param('userId') userId: string, @CurrentUser('id') me: string) {
    return this.follows.unfollow(userId, me);
  }

  @Get('relationships/:userId')
  relationship(@Param('userId') userId: string, @CurrentUser('id') me: string) {
    return this.follows.relationship(me, userId);
  }

  @Get('follow/followers')
  followers(@User('id') me, @Query() q: ListQueryDto) {
    return this.follows.followers(me, q.limit, q.cursor);
  }

  
  @Get('follow/following')
  following(@User('id') me, @Query() q: ListQueryDto) {
    return this.follows.following(me, q.limit, q.cursor);
  }

}
