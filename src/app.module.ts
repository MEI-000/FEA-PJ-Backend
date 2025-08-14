import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FollowsModule } from './follows/follows.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/twitter-clone'),
    AuthModule,
    FollowsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
