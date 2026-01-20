import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Partner } from './partner.entity';

/**
 * Entidad WebhookEvent - Registra los eventos de webhook enviados/recibidos
 */
@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  partnerId: string;

  @ManyToOne(() => Partner, (partner) => partner.webhookEvents)
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @Column({ type: 'varchar', length: 100 })
  eventType: string; // Tipo de evento (ej: 'service.purchased', 'appointment.confirmed')

  @Column({ type: 'varchar', length: 20 })
  direction: string; // 'outgoing' | 'incoming'

  @Column({ type: 'text' })
  payload: string; // JSON stringificado del payload

  @Column({ type: 'varchar', length: 255, nullable: true })
  signature: string; // Firma HMAC del webhook

  @Column({ type: 'int', default: 0 })
  retryCount: number; // Número de reintentos si falló

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string; // 'pending' | 'sent' | 'failed' | 'received'

  @Column({ type: 'text', nullable: true })
  response: string; // Respuesta del webhook (si es saliente)

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
