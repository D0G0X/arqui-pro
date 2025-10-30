import { WebSocketGateway } from '@nestjs/websockets';
import { NotificacionService } from './notificacion.service';

@WebSocketGateway()
export class NotificacionGateway {
  constructor(private readonly notificacionService: NotificacionService) {}
}
