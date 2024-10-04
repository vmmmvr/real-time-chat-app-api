import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // You can specify allowed origins here
  },
})
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);

    // Number of events to send per second (1000 events per minute = 16.67 events per second)
    const eventsPerSecond = 17;
    let eventCount = 0;
    const totalEvents = 1000;

    // Emit events at regular intervals (1000ms / eventsPerSecond)
    // const intervalId = setInterval(() => {
    //   if (eventCount >= totalEvents) {
    //     clearInterval(intervalId); // Stop after sending 1000 events
    //     console.log(`Sent ${totalEvents} events to client ${client.id}`);
    //   } else {
    //     client.emit('event', { message: `Welcome, client ${client.id}, event #${eventCount + 1}` });
    //     eventCount++;
    //   }
    // }, 1000 / eventsPerSecond); // Interval in milliseconds for each event
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { sender: string; message: string }, @ConnectedSocket() client: Socket) {
    console.log(`Message from ${data.sender}: ${data.message}`);

    // Emit the message to all connected clients
    this.server.emit('message', data);
  }
}
