import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findById(id: string) {
    return this.userModel
      .findById(id)
      .select('username displayName avatarUrl bio')
      .lean();
  }

  search(q: string, limit = 20, page = 0) {
    const filter: FilterQuery<User> = {
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } },
      ],
    };
    return this.userModel
      .find(filter)
      .select('username displayName avatarUrl')
      .sort({ username: 1 })
      .skip(page * limit)
      .limit(limit)
      .lean();
  }
}
