import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Partner } from '../entities/partner.entity';
import { WebhookEvent } from '../entities/webhook-event.entity';
import { HmacService } from '../common/services/hmac.service';
import { PartnerService } from '../partner/partner.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly n8nWebhookUrl: string;

  constructor(
    @InjectRepository(WebhookEvent)
    private webhookEventRepository: Repository<WebhookEvent>,
    private httpService: HttpService,
    private hmacService: HmacService,
    private partnerService: PartnerService,
    private configService: ConfigService,
  ) {
    this.n8nWebhookUrl = this.configService.get<string>(
      'N8N_WEBHOOK_URL',
      'http://localhost:5678/webhook',
    );
  }

  /**
   * Notifica a todos los partners suscritos a un evento
   */
  async notifyPartners(
    eventType: string,
    payload: Record<string, any>,
  ): Promise<void> {
    // Obtener partners suscritos al evento
    const partners = await this.partnerService.getPartnersSubscribedToEvent(eventType);

    if (partners.length === 0) {
      this.logger.debug(`No hay partners suscritos al evento: ${eventType}`);
      return;
    }

    this.logger.log(
      `Notificando evento ${eventType} a ${partners.length} partner(s)`,
    );

    // Enviar webhook a cada partner
    const promises = partners.map((partner) =>
      this.sendWebhookToPartner(partner, eventType, payload),
    );

    await Promise.allSettled(promises);

    // Enviar evento al Event Bus n8n
    await this.sendToN8n(eventType, payload);
  }

  /**
   * Envía un webhook a un partner específico
   */
  private async sendWebhookToPartner(
    partner: Partner,
    eventType: string,
    payload: Record<string, any>,
  ): Promise<void> {
    // Crear payload con metadata
    const webhookPayload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data: payload,
    };

    // Firmar el payload
    const signature = this.hmacService.sign(webhookPayload, partner.secret);

    // Crear registro del evento
    const webhookEvent = this.webhookEventRepository.create({
      partnerId: partner.id,
      eventType,
      direction: 'outgoing',
      payload: JSON.stringify(webhookPayload),
      signature,
      status: 'pending',
    });

    await this.webhookEventRepository.save(webhookEvent);

    try {
      // Enviar webhook HTTP POST
      const response = await firstValueFrom(
        this.httpService.post(partner.webhookUrl, webhookPayload, {
          headers: {
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': eventType,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 segundos timeout
        }),
      );

      // Actualizar estado del evento
      webhookEvent.status = 'sent';
      webhookEvent.response = JSON.stringify({
        status: response.status,
        statusText: response.statusText,
      });
      await this.webhookEventRepository.save(webhookEvent);

      this.logger.log(
        `✅ Webhook enviado exitosamente a ${partner.name} (${partner.webhookUrl})`,
      );
    } catch (error) {
      // Actualizar estado del evento con error
      webhookEvent.status = 'failed';
      webhookEvent.errorMessage = error.message;
      webhookEvent.retryCount += 1;
      await this.webhookEventRepository.save(webhookEvent);

      this.logger.error(
        `❌ Error enviando webhook a ${partner.name}: ${error.message}`,
      );

      // TODO: Implementar sistema de reintentos con cola (RabbitMQ, Bull, etc.)
    }
  }

  /**
   * Envía evento al Event Bus n8n
   */
  private async sendToN8n(
    eventType: string,
    payload: Record<string, any>,
  ): Promise<void> {
    try {
      const n8nPayload = {
        event: eventType,
        timestamp: new Date().toISOString(),
        data: payload,
        source: 'payment-service',
      };

      await firstValueFrom(
        this.httpService.post(this.n8nWebhookUrl, n8nPayload, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }),
      );

      this.logger.log(`✅ Evento enviado a n8n Event Bus: ${eventType}`);
    } catch (error) {
      this.logger.warn(
        `⚠️ Error enviando evento a n8n (no crítico): ${error.message}`,
      );
      // No lanzamos error porque n8n es opcional
    }
  }

  /**
   * Procesa un webhook entrante (recibido de un partner externo)
   */
  async processIncomingWebhook(
    partnerId: string,
    eventType: string,
    payload: Record<string, any>,
    signature: string,
  ): Promise<WebhookEvent> {
    // Obtener partner
    const partner = await this.partnerService.getPartnerById(partnerId);

    // Verificar firma
    const isValid = this.hmacService.verify(
      payload,
      signature,
      partner.secret,
    );

    if (!isValid) {
      throw new Error('Firma HMAC inválida');
    }

    // Crear registro del evento
    const webhookEvent = this.webhookEventRepository.create({
      partnerId: partner.id,
      eventType,
      direction: 'incoming',
      payload: JSON.stringify(payload),
      signature,
      status: 'received',
    });

    const savedEvent = await this.webhookEventRepository.save(webhookEvent);

    this.logger.log(
      `✅ Webhook entrante procesado: ${eventType} de ${partner.name}`,
    );

    // Enviar evento validado a n8n
    await this.sendToN8n(eventType, {
      ...payload,
      partnerId: partner.id,
      partnerName: partner.name,
    });

    return savedEvent;
  }

  /**
   * Obtiene el historial de eventos de webhook
   */
  async getWebhookHistory(
    partnerId?: string,
    eventType?: string,
    direction?: 'incoming' | 'outgoing',
  ): Promise<WebhookEvent[]> {
    const query = this.webhookEventRepository.createQueryBuilder('event');

    if (partnerId) {
      query.andWhere('event.partnerId = :partnerId', { partnerId });
    }

    if (eventType) {
      query.andWhere('event.eventType = :eventType', { eventType });
    }

    if (direction) {
      query.andWhere('event.direction = :direction', { direction });
    }

    query.orderBy('event.createdAt', 'DESC');
    query.limit(100); // Limitar a 100 eventos más recientes

    return await query.getMany();
  }
}
