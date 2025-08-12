// src/notifications/notifications.controller.ts
import { Controller, Get, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async myNotifications(@Req() req) {
    return this.notificationsService.findForUser(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }
}
