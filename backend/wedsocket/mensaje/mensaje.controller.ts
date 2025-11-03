import { Controller, Post, Body, Logger } from '@nestjs/common';
import { MensajeGateway } from './mensaje.gateway';

@Controller('mensajes')
export class MensajeController {
  private readonly logger = new Logger(MensajeController.name);

  constructor(private readonly mensajeGateway: MensajeGateway) {}

  @Post('nuevoMensaje')
  async handleNuevoMensaje(@Body() payload: { mensaje: any; conversacion_id: string }) {
    this.logger.log('Received new message notification from Rails API');
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);
    
    try {
      // Emitir el mensaje a través del WebSocket Gateway
      this.mensajeGateway.server
        .to(`conversacion_${payload.conversacion_id}`)
        .emit('nuevoMensaje', payload.mensaje);

      this.logger.log(`Message emitted to room: conversacion_${payload.conversacion_id}`);
      return { success: true, message: 'Mensaje emitido correctamente' };
    } catch (error) {
      this.logger.error(`Error emitting message: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
