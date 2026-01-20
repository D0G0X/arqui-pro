import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { WebhookEvent } from '../entities/webhook-event.entity';
import { IncomingWebhookDto } from './dto/incoming-webhook.dto';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('incoming/:partnerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recibir un webhook entrante de un partner externo' })
  @ApiHeader({
    name: 'X-Webhook-Signature',
    description: 'Firma HMAC del webhook',
    required: true,
  })
  @ApiHeader({
    name: 'X-Webhook-Event',
    description: 'Tipo de evento',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Webhook procesado exitosamente', type: WebhookEvent })
  @ApiResponse({ status: 400, description: 'Firma inválida o datos incorrectos' })
  async receiveWebhook(
    @Param('partnerId') partnerId: string,
    @Body() dto: IncomingWebhookDto,
    @Headers('x-webhook-signature') signature: string,
    @Headers('x-webhook-event') eventType: string,
  ): Promise<WebhookEvent> {
    if (!signature) {
      throw new BadRequestException('Header X-Webhook-Signature es requerido');
    }

    if (!eventType) {
      throw new BadRequestException('Header X-Webhook-Event es requerido');
    }

    return await this.webhookService.processIncomingWebhook(
      partnerId,
      eventType,
      dto.data,
      signature,
    );
  }

  @Get('history')
  @ApiOperation({ summary: 'Obtener historial de eventos de webhook' })
  @ApiResponse({ status: 200, description: 'Historial de eventos', type: [WebhookEvent] })
  async getHistory(
    @Query('partnerId') partnerId?: string,
    @Query('eventType') eventType?: string,
    @Query('direction') direction?: 'incoming' | 'outgoing',
  ): Promise<WebhookEvent[]> {
    return await this.webhookService.getWebhookHistory(
      partnerId,
      eventType,
      direction,
    );
  }
}
