import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
	private readonly logger = new Logger(ChatService.name);
	constructor(private readonly http: HttpService) {}

	async createMessage(dto: { contenido: string; remitente_id: number; conversacion_id: number }, authorization?: string) {
		const apiUrl = process.env.APIREST_URL || 'http://localhost:3000';
		const url = `${apiUrl}/api/v1/mensajes`;
		const headers: Record<string, string> = { 'Content-Type': 'application/json' };
		if (authorization) headers['Authorization'] = authorization;

		const payload = { mensaje: { contenido: dto.contenido, remitente_id: dto.remitente_id, conversacion_id: dto.conversacion_id } };
		try {
			const resp$ = this.http.post(url, payload, { headers });
			const resp = (await lastValueFrom(resp$)) as any;
			return resp?.data ?? resp;
		} catch (err: any) {
			this.logger.error('Error creating message in APIREST', err?.message ?? err);
			throw err;
		}
	}
}
