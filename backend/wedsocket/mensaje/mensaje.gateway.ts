import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MensajeService } from './mensaje.service';

@WebSocketGateway({
  namespace: '/mensajes',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
})
export class MensajeGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly mensajeService: MensajeService) {}

  @SubscribeMessage('enviarMensaje')
  async handleEnviarMensaje(
    @MessageBody()
    payload: {
      contenido: string;
      emisor_id: string;
      conversacion_id: string;
      tipo: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const mensajeCreado = await this.mensajeService.crearMensaje(payload);
      
      // Emitir el mensaje a todos los clientes en la sala de la conversación
      this.server
        .to(`conversacion_${payload.conversacion_id}`)
        .emit('nuevoMensaje', mensajeCreado);

      return { success: true, mensaje: mensajeCreado };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('unirseAConversacion')
  async handleUnirseAConversacion(
    @MessageBody() conversacionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Unirse a la sala de la conversación
      await client.join(`conversacion_${conversacionId}`);
      
      // Obtener mensajes anteriores
      const mensajes = await this.mensajeService.obtenerMensajesPorConversacion(
        conversacionId,
      );
      
      return { success: true, mensajes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('dejarConversacion')
  async handleDejarConversacion(
    @MessageBody() conversacionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await client.leave(`conversacion_${conversacionId}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('marcarComoLeidos')
  async handleMarcarComoLeidos(
    @MessageBody()
    payload: {
      conversacion_id: string;
      usuario_id: string;
    },
  ) {
    try {
      const resultado = await this.mensajeService.marcarMensajesComoLeidos(
        payload.conversacion_id,
        payload.usuario_id,
      );
      
      // Notificar a todos en la conversación que los mensajes fueron leídos
      this.server
        .to(`conversacion_${payload.conversacion_id}`)
        .emit('mensajesLeidos', {
          conversacion_id: payload.conversacion_id,
          usuario_id: payload.usuario_id,
        });

      return { success: true, resultado };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}