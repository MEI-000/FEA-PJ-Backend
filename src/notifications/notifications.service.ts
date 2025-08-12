import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { Model } from 'mongoose';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {

    private readonly logger = new Logger(NotificationsService.name);
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        private gateway: NotificationsGateway,
    ) {}

    async create(recipient: string, sender: string, type: string, tweetId: string | null = null) {
        const notif = await this.notificationModel.create({
        recipient,
        sender,
        type,
        tweetId: tweetId ? tweetId : null,
        });
        this.gateway.sendNotification(recipient, {
        _id: notif._id,
        sender,
        type,
        tweetId,
        createdAt: notif.createdAt,
        });
        return notif;
    }

    async findForUser(username: string) {
        return this.notificationModel.find({ recipient: username }).sort({ createdAt: -1 }).lean();
    }

    async markRead(notificationId: string) {
        return this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    }
}
