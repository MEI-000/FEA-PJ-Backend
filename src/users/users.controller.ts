// users.controller.ts
import { Controller, Get, Patch, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@User('id') userId: string) {
    console.log('userId:', userId);
    return this.usersService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @User('id') userId: string,
    @Body() updateData: UpdateProfileDto,
  ) {
    return this.usersService.updateUserProfile(userId, updateData);
  }
}