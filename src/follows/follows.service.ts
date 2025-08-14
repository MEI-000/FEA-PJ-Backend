import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow } from './schemas/follow.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<Follow>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  private toId(id: string) { return new Types.ObjectId(id); }

  private async ensureUser(id: string) {
    const exists = await this.userModel.exists({ _id: this.toId(id) });
    if (!exists) throw new NotFoundException('User not found');
  }

  async follow(targetId: string, me: string) {
    if (me === targetId) throw new BadRequestException('Cannot follow yourself');
    await this.ensureUser(targetId);
    try {
      await this.followModel.create({ followerId: this.toId(me), followingId: this.toId(targetId) });
    } catch (e: any) {
      if (e?.code === 11000) throw new ConflictException('Already following');
      throw e;
    }
    return { ok: true };
  }

  async unfollow(targetId: string, me: string) {
    await this.followModel.deleteOne({ followerId: this.toId(me), followingId: this.toId(targetId) });
    return { ok: true };
  }

  async relationship(me: string, otherId: string) {
    await this.ensureUser(otherId);
    const [iFollow, followsMe] = await Promise.all([
      this.followModel.exists({ followerId: this.toId(me),    followingId: this.toId(otherId) }),
      this.followModel.exists({ followerId: this.toId(otherId), followingId: this.toId(me)     }),
    ]);
    return { iFollow: !!iFollow, followsMe: !!followsMe, mutual: !!iFollow && !!followsMe };
  }

  async followers(userId: string, limit = 20, cursor?: string) {
    const query: any = { followingId: this.toId(userId) };
    if (cursor) query._id = { $lt: this.toId(cursor) };

    const rows = await this.followModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate({ path: 'followerId', select: 'username displayName avatarUrl' })
      .lean();

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, -1) : rows;
    const nextCursor = hasMore ? String(items[items.length - 1]._id) : undefined;

    return {
      items: items.map((r: any) => ({
        id: String(r.followerId._id),
        username: r.followerId.username,
        displayName: r.followerId.displayName,
        avatarUrl: r.followerId.avatarUrl,
        followedAt: r.createdAt,
      })),
      nextCursor,
    };
  }

  async following(userId: string, limit = 20, cursor?: string) {
    const query: any = { followerId: this.toId(userId) };
    if (cursor) query._id = { $lt: this.toId(cursor) };

    const rows = await this.followModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate({ path: 'followingId', select: 'username displayName avatarUrl' })
      .lean();

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, -1) : rows;
    const nextCursor = hasMore ? String(items[items.length - 1]._id) : undefined;

    return {
      items: items.map((r: any) => ({
        id: String(r.followingId._id),
        username: r.followingId.username,
        displayName: r.followingId.displayName,
        avatarUrl: r.followingId.avatarUrl,
        followedAt: r.createdAt,
      })),
      nextCursor,
    };
  }
}
