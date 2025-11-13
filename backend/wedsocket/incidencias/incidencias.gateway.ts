import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/incidencias',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
})
export class IncidenciasGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(IncidenciasGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`🔌 Cliente conectado al namespace /incidencias: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Cliente desconectado del namespace /incidencias: ${client.id}`);
  }

  /**
   * Unirse a la sala de un usuario para recibir notificaciones de incidencias
   */
  @SubscribeMessage('join_usuario')
  handleJoinUsuario(
    @MessageBody() payload: { usuario_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `usuario:${payload.usuario_id}`;
    client.join(room);
    this.logger.log(`👤 Cliente ${client.id} se unió a sala de incidencias ${room}`);
    return { status: 'ok', room };
  }

  /**
   * Unirse a la sala de moderadores para recibir todas las incidencias
   */
  @SubscribeMessage('join_moderadores')
  handleJoinModeradores(
    @ConnectedSocket() client: Socket,
  ) {
    const room = 'moderadores';
    client.join(room);
    this.logger.log(`🛡️ Cliente ${client.id} se unió a sala de moderadores`);
    return { status: 'ok', room };
  }

  /**
   * Unirse a la sala de una incidencia específica
   */
  @SubscribeMessage('join_incidencia')
  handleJoinIncidencia(
    @MessageBody() payload: { incidencia_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `incidencia:${payload.incidencia_id}`;
    client.join(room);
    this.logger.log(`📋 Cliente ${client.id} se unió a sala ${room}`);
    return { status: 'ok', room };
  }

  /**
   * Emitir evento de nueva incidencia
   */
  emitNuevaIncidencia(
    usuario_emisor_id: string,
    usuario_infractor_id: string,
    incidencia: any,
  ) {
    this.logger.log(`📢 Emitiendo nueva incidencia: ${incidencia.id}`);
    
    // Notificar al usuario emisor
    this.server.to(`usuario:${usuario_emisor_id}`).emit('incidencia:nueva', incidencia);
    
    // Notificar al usuario infractor
    this.server.to(`usuario:${usuario_infractor_id}`).emit('incidencia:nueva', incidencia);
    
    // Notificar a todos los moderadores
    this.server.to('moderadores').emit('incidencia:nueva', incidencia);
  }

  /**
   * Emitir evento de cambio de estado de incidencia
   */
  emitIncidenciaEstadoCambiado(
    incidencia_id: string,
    usuario_emisor_id: string,
    usuario_infractor_id: string,
    data: any,
  ) {
    this.logger.log(`📢 Emitiendo cambio de estado de incidencia: ${incidencia_id}`);
    this.logger.log(`   Estado: ${data.estado_anterior} → ${data.estado_nuevo}`);
    
    // Emitir a la sala de la incidencia
    this.server.to(`incidencia:${incidencia_id}`).emit('incidencia:estado_cambiado', data);
    
    // Notificar al usuario emisor
    this.server.to(`usuario:${usuario_emisor_id}`).emit('incidencia:estado_cambiado', data);
    
    // Notificar al usuario infractor
    this.server.to(`usuario:${usuario_infractor_id}`).emit('incidencia:estado_cambiado', data);
    
    // Notificar a moderadores
    this.server.to('moderadores').emit('incidencia:estado_cambiado', data);
  }

  /**
   * Emitir evento de incidencia asignada a moderador
   */
  emitIncidenciaAsignada(
    moderador_id: string,
    incidencia: any,
  ) {
    this.logger.log(`📢 Emitiendo incidencia asignada al moderador: ${moderador_id}`);
    this.server.to(`usuario:${moderador_id}`).emit('incidencia:asignada', incidencia);
    this.server.to('moderadores').emit('incidencia:asignada', incidencia);
  }

  /**
   * Emitir evento de incidencia resuelta
   */
  emitIncidenciaResuelta(
    incidencia_id: string,
    usuario_emisor_id: string,
    usuario_infractor_id: string,
    incidencia: any,
  ) {
    this.logger.log(`📢 Emitiendo incidencia resuelta: ${incidencia_id}`);
    
    this.server.to(`incidencia:${incidencia_id}`).emit('incidencia:resuelta', incidencia);
    this.server.to(`usuario:${usuario_emisor_id}`).emit('incidencia:resuelta', incidencia);
    this.server.to(`usuario:${usuario_infractor_id}`).emit('incidencia:resuelta', incidencia);
    this.server.to('moderadores').emit('incidencia:resuelta', incidencia);
  }
}
