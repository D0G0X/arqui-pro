import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WebhookEvent } from './webhook-event.entity';

/**
 * Entidad Partner - Representa un partner B2B registrado
 * 
 * Cada partner puede recibir webhooks cuando ocurren eventos específicos
 * en el sistema (ej: service.purchased, appointment.confirmed)
 */
@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text' })
  webhookUrl: string;

  @Column({ type: 'text' })
  secret: string; // Secret compartido para firmar webhooks con HMAC

  @Column('text', { array: true, default: [] })
  subscribedEvents: string[]; // Eventos a los que se suscribe (ej: ['service.purchased', 'appointment.confirmed'])

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => WebhookEvent, (event) => event.partner)
  webhookEvents: WebhookEvent[];
}
