import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { ListQueryDto } from './dto/list.dto';

// Use your Member B auth
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller()
export class FollowsController {
  constructor(private follows: FollowsService) {}

  @Post('follow/:userId')
  follow(@Param('userId') userId: string, @CurrentUser('sub') me: string) {
    return this.follows.follow(userId, me);
  }

  @Delete('follow/:userId')
  unfollow(@Param('userId') userId: string, @CurrentUser('sub') me: string) {
    return this.follows.unfollow(userId, me);
  }

  @Get('relationships/:userId')
  relationship(@Param('userId') userId: string, @CurrentUser('sub') me: string) {
    return this.follows.relationship(me, userId);
  }

  @Get('users/:id/followers')
  followers(@Param('id') id: string, @Query() q: ListQueryDto) {
    return this.follows.followers(id, q.limit, q.cursor);
  }

  @Get('users/:id/following')
  following(@Param('id') id: string, @Query() q: ListQueryDto) {
    return this.follows.following(id, q.limit, q.cursor);
  }
}
