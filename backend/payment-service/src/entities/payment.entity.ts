import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad Payment - Representa un pago procesado
 */
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  provider: string; // 'mock' | 'stripe' | 'paypal'

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerPaymentId: string; // ID del pago en el proveedor externo

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 50 })
  status: string; // 'pending' | 'completed' | 'failed' | 'refunded'

  @Column({ type: 'varchar', length: 255 })
  serviceType: string; // Tipo de servicio pagado (ej: 'asesoria_tecnica', 'diseno_arquitectonico')

  @Column({ type: 'uuid', nullable: true })
  userId: string; // ID del usuario que realizó el pago

  @Column({ type: 'uuid', nullable: true })
  projectId: string; // ID del proyecto relacionado (opcional)

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Datos adicionales del pago

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
