import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { Follow, FollowSchema } from './schemas/follow.schema';
import { User, UserSchema } from '../auth/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: User.name,   schema: UserSchema   },
    ]),
  ],
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule {}
