import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
