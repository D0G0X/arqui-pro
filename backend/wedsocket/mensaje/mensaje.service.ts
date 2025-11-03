import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MensajeService {
  private readonly apiUrl = 'http://localhost:3000/api/v1'; // URL de tu API Rails

  constructor(private readonly httpService: HttpService) {}

  async crearMensaje(datos: {
    contenido: string;
    emisor_id: string;
    conversacion_id: string;
    tipo: string;
  }) {
    try {
      const mensajeData = {
        mensaje: {
          contenido: datos.contenido,
          remitente_id: datos.emisor_id,
          conversacion_id: datos.conversacion_id,
          leido: false,
          fecha_envio: new Date().toISOString()
        }
      };
      
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/mensajes`, mensajeData),
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear mensaje: ${error.message}`);
    }
  }

  async obtenerMensajesPorConversacion(conversacionId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/conversaciones/${conversacionId}/mensajes`),
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener mensajes: ${error.message}`);
    }
  }

  async marcarMensajesComoLeidos(conversacionId: string, usuarioId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${this.apiUrl}/conversaciones/${conversacionId}/mensajes/marcar_leidos`,
          { usuario_id: usuarioId },
        ),
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al marcar mensajes como leídos: ${error.message}`);
    }
  }
}