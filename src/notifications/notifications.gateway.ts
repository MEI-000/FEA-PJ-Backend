// src/notifications/notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger(NotificationsGateway.name);

  handleConnection(client: any) {
    this.logger.debug(`Client connected: ${client.id}`);
    client.on('register', (username: string) => {
      client.join(`user_${username}`);
      this.logger.debug(`Client ${client.id} joined room user_${username}`);
    });
  }

  handleDisconnect(client: any) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  sendNotification(recipientUsername: string, payload: any) {
    this.server.to(`user_${recipientUsername}`).emit('notification', payload);
  }
}
