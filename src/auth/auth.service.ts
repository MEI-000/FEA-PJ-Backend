import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(body: { username: string; email: string; password: string }) {
    const { username, email, password } = body;

    // check if the user existed or not
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new BadRequestException(
        'Username or email already taken, please try another one',
      );
    }

    // encrypt pwd
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return {
      message: 'User registered successfully',
      user: { username, email },
    };
  }

  async login(body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const payload = { sub: user._id, username: user.username };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    };
  }
}
