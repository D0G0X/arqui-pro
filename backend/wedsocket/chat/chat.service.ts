import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
	private readonly logger = new Logger(ChatService.name);
	constructor(private readonly http: HttpService) {}

	async createMessage(dto: { contenido: string; remitente_id: string; conversacion_id: string }, authorization?: string) {
		const apiUrl = process.env.APIREST_URL || 'http://localhost:3000';
		const url = `${apiUrl}/api/v1/mensajes`;
		const headers: Record<string, string> = { 'Content-Type': 'application/json' };
		if (authorization) {
			headers['Authorization'] = authorization.startsWith('Bearer ') ? authorization : `Bearer ${authorization}`;
		}

		const payload = { 
			mensaje: { 
				contenido: dto.contenido, 
				remitente_id: dto.remitente_id, 
				conversacion_id: dto.conversacion_id,
				leido: false,
				fecha_envio: new Date().toISOString()
			} 
		};
		
		this.logger.log(`🌐 Creando mensaje en ${url}`);
		this.logger.log(`📦 Payload:`, JSON.stringify(payload, null, 2));
		this.logger.log(`🔑 Authorization:`, authorization ? 'Presente' : 'Ausente');
		
		try {
			const resp$ = this.http.post(url, payload, { headers });
			const resp = (await lastValueFrom(resp$)) as any;
			this.logger.log(`✅ Mensaje creado exitosamente:`, resp?.data);
			return resp?.data ?? resp;
		} catch (err: any) {
			this.logger.error('❌ Error creating message in APIREST');
			this.logger.error('❌ Error message:', err?.message);
			this.logger.error('❌ Error response:', err?.response?.data);
			this.logger.error('❌ Error status:', err?.response?.status);
			this.logger.error('❌ Full error:', JSON.stringify(err?.response?.data || err, null, 2));
			throw err;
		}
	}
}
