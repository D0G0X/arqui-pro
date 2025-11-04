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

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
  transports: ['websocket', 'polling']
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  constructor(private readonly chatService: ChatService) {
    console.log('ChatGateway initialized');
  }

  // Método que será llamado desde el controlador de Rails
  @SubscribeMessage('nuevaConversacion')
  notificarNuevaConversacion(
    @MessageBody() data: { conversacion: any; participante_ids: string[] }
  ) {
    // Notificar a todos los participantes de la conversación
    data.participante_ids.forEach((participanteId: string) => {
      this.server.to(`usuario_${participanteId}`).emit('nuevaConversacion', data.conversacion);
    });
    return { success: true };
  }

  handleConnection(client: Socket) {
    console.log('Chat client connected', client.id);
    client.emit('connection:established', { status: 'ok' });
  }

  handleDisconnect(client: Socket) {
    console.log('Chat client disconnected', client.id);
  }

  @SubscribeMessage('join_conversation')
  handleJoin(@MessageBody() data: { conversacion_id: string }, @ConnectedSocket() client: Socket) {
    const room = `conversacion:${data.conversacion_id}`;
    client.join(room);
    client.emit('conversation:joined', { conversacion_id: data.conversacion_id });
  }

  @SubscribeMessage('leave_conversation')
  handleLeave(@MessageBody() data: { conversacion_id: string }, @ConnectedSocket() client: Socket) {
    const room = `conversacion:${data.conversacion_id}`;
    client.leave(room);
    client.emit('conversation:left', { conversacion_id: data.conversacion_id });
  }

  @SubscribeMessage('message:create')
  async handleMessageCreate(@MessageBody() payload: { 
    contenido: string; 
    remitente_id: string; 
    conversacion_id: string 
  }, @ConnectedSocket() client: Socket) {
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
  handleTyping(@MessageBody() payload: { 
    usuario_id: string; 
    conversacion_id: string; 
    typing: boolean 
  }, @ConnectedSocket() client: Socket) {
    const room = `conversacion:${payload.conversacion_id}`;
    this.server.to(room).emit('message:typing', payload);
  }
}
