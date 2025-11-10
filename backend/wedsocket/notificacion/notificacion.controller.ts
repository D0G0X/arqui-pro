import { Controller, Post, Body, Logger } from '@nestjs/common';
import { NotificacionGateway } from './notificacion.gateway';

@Controller('api/notificaciones')
export class NotificacionController {
  private readonly logger = new Logger(NotificacionController.name);

  constructor(private readonly notificacionGateway: NotificacionGateway) {}

  @Post('emit')
  async emitirNotificacion(@Body() payload: {
    evento: string;
    data: any;
    usuario_id?: number;
  }) {
    this.logger.log(`📢 Recibido evento desde Rails: ${payload.evento}`);
    
    try {
      // Emitir el evento a todos los clientes conectados
      this.notificacionGateway.server.emit(payload.evento, payload.data);
      
      this.logger.log(`✅ Evento ${payload.evento} emitido a todos los clientes`);
      
      return { 
        status: 'success', 
        message: `Evento ${payload.evento} emitido correctamente`,
        evento: payload.evento
      };
    } catch (error) {
      this.logger.error(`❌ Error emitiendo evento: ${error.message}`);
      return { 
        status: 'error', 
        message: error.message 
      };
    }
  }
}
