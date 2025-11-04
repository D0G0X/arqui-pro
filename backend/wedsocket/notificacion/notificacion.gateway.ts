import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificacionService } from './notificacion.service';

@WebSocketGateway({
  namespace: '/notificacion',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingInterval: 25000,
  pingTimeout: 60000,
})
export class NotificacionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificacionService: NotificacionService) {
    console.log('NotificacionGateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('Notification client connected', client.id);
    client.emit('connected', { status: 'ok' });
  }

  handleDisconnect(client: Socket) {
    console.log('Notification client disconnected', client.id);
  }
}
