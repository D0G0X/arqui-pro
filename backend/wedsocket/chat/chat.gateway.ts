import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log('chat client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('chat client disconnected', client.id);
  }

  @SubscribeMessage('join_conversation')
  handleJoin(@MessageBody() data: { conversacion_id: number }, @ConnectedSocket() client: Socket) {
    const room = `conversacion:${data.conversacion_id}`;
    client.join(room);
    client.emit('conversation:joined', { conversacion_id: data.conversacion_id });
  }

  @SubscribeMessage('leave_conversation')
  handleLeave(@MessageBody() data: { conversacion_id: number }, @ConnectedSocket() client: Socket) {
    const room = `conversacion:${data.conversacion_id}`;
    client.leave(room);
    client.emit('conversation:left', { conversacion_id: data.conversacion_id });
  }

  @SubscribeMessage('message:create')
  async handleMessageCreate(@MessageBody() payload: { contenido: string; remitente_id: number; conversacion_id: number }, @ConnectedSocket() client: Socket) {
    const tokenHeader = (client.handshake.headers['authorization'] as string) || (client.handshake.auth && (client.handshake.auth as any).token) || '';
    try {
      const created = await this.chatService.createMessage(payload, tokenHeader);
      const room = `conversacion:${payload.conversacion_id}`;
      this.server.to(room).emit('message:new', created);
      return { status: 'ok' };
    } catch (err) {
      client.emit('error', { message: 'could_not_create_message' });
      return { status: 'error' };
    }
  }

  @SubscribeMessage('message:typing')
  handleTyping(@MessageBody() payload: { usuario_id: number; conversacion_id: number; typing: boolean }, @ConnectedSocket() client: Socket) {
    const room = `conversacion:${payload.conversacion_id}`;
    this.server.to(room).emit('message:typing', payload);
  }
}
