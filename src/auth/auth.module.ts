import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../users/user.schema';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // Database Module
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // Auth-jwt Module
    PassportModule,
    JwtModule.register({
      secret: 'jwt_secret_key', // 👈 can be changed to read from .env
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
