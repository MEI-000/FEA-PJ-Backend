import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TweetGateway {
  @WebSocketServer()
  server: Server;

  sendNewTweet(tweet: any) {
    this.server.emit('tweetCreated', tweet);
  }
}
