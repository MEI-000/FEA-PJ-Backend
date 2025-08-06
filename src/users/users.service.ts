// users.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      username: user.username,
      email: user.email,
      contact: user.contact,
      preference: user.preference,
      // possible more fields
      avatar: user.avatar || null,
      createdAt: user.createdAt,
    };
  }
  async updateUserProfile(userId: string, updateData: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ensure username is unique
    if (updateData.username && updateData.username !== user.username) {
      const existing = await this.userModel.findOne({
        username: updateData.username,
      });
      if (existing) {
        throw new BadRequestException('Username already exists');
      }
      user.username = updateData.username;
    }
    // Update contact
    if (updateData.contact !== undefined) {
      user.contact = updateData.contact;
    }

    // Update preference
    if (updateData.preference !== undefined) {
      user.preference = updateData.preference;
    }
    // possbile more fields like email, password, ...

    await user.save();
    return {
      message: 'Profile updated successfully',
      username: user.username,
      //possible more fields
      contact: user.contact,
      preference: user.preference,
    };
  }
}
