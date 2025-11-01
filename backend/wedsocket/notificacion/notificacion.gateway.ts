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
import { NotificacionService } from './notificacion.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/notificaciones' })
export class NotificacionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificacionService: NotificacionService) {}

  handleConnection(client: Socket) {
    console.log('notificacion client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('notificacion client disconnected', client.id);
  }

  @SubscribeMessage('usuario:conectar')
  handleUsuarioConectar(@MessageBody() data: { usuario_id: string }, @ConnectedSocket() client: Socket) {
    const room = `usuario:${data.usuario_id}`;
    client.join(room);
    client.emit('usuario:conectado', { usuario_id: data.usuario_id });
    
    // Notificar presencia a otros usuarios
    this.server.emit('usuario:online', { usuario_id: data.usuario_id, estado: 'online' });
  }

  @SubscribeMessage('usuario:desconectar')
  handleUsuarioDesconectar(@MessageBody() data: { usuario_id: string }, @ConnectedSocket() client: Socket) {
    const room = `usuario:${data.usuario_id}`;
    client.leave(room);
    
    // Notificar ausencia a otros usuarios
    this.server.emit('usuario:offline', { usuario_id: data.usuario_id, estado: 'offline' });
  }

  @SubscribeMessage('notificacion:marcar_leida')
  async handleMarcarLeida(@MessageBody() payload: { notificacion_id: string }, @ConnectedSocket() client: Socket) {
    const tokenHeader = (client.handshake.headers['authorization'] as string) || (client.handshake.auth && (client.handshake.auth as any).token) || '';
    try {
      const updated = await this.notificacionService.markAsRead(payload.notificacion_id, tokenHeader);
      client.emit('notificacion:actualizada', updated);
      return { status: 'ok' };
    } catch (err) {
      client.emit('error', { message: 'could_not_mark_notification' });
      return { status: 'error' };
    }
  }

  // Método para enviar notificación desde otros servicios
  enviarNotificacion(usuario_id: string, notificacion: any) {
    const room = `usuario:${usuario_id}`;
    this.server.to(room).emit('notificacion:nueva', notificacion);
  }

  // Método para broadcast de notificaciones del sistema
  enviarNotificacionSistema(notificacion: any) {
    this.server.emit('notificacion:sistema', notificacion);
  }
}
