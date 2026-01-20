import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentProvider } from './interfaces/payment-provider.interface';
import { MockAdapter } from './adapters/mock-adapter';
import { StripeAdapter } from './adapters/stripe-adapter';
import { WebhookService } from '../webhook/webhook.service';

@Injectable()
export class PaymentService {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private mockAdapter: MockAdapter,
    private stripeAdapter: StripeAdapter,
    private webhookService: WebhookService,
  ) {
    // Registrar adaptadores disponibles
    this.providers.set('mock', mockAdapter);
    this.providers.set('stripe', stripeAdapter);
  }

  /**
   * Procesa un pago usando el proveedor especificado
   */
  async processPayment(
    provider: string,
    amount: number,
    currency: string,
    serviceType: string,
    userId?: string,
    projectId?: string,
    metadata?: Record<string, any>,
  ): Promise<Payment> {
    const adapter = this.providers.get(provider.toLowerCase());

    if (!adapter) {
      throw new BadRequestException(
        `Proveedor de pago no soportado: ${provider}. Proveedores disponibles: ${Array.from(this.providers.keys()).join(', ')}`,
      );
    }

    // Procesar pago con el adaptador
    const paymentMetadata = {
      userId,
      projectId,
      serviceType,
      ...metadata,
    };

    const result = await adapter.processPayment(amount, currency, paymentMetadata);

    // Guardar pago en base de datos
    const payment = this.paymentRepository.create({
      provider: provider.toLowerCase(),
      providerPaymentId: result.providerPaymentId,
      amount,
      currency,
      status: result.status,
      serviceType,
      userId,
      projectId,
      metadata: paymentMetadata,
      errorMessage: result.success ? null : result.message,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Si el pago fue exitoso, notificar a los partners suscritos
    if (result.success && result.status === 'completed') {
      await this.webhookService.notifyPartners('service.purchased', {
        paymentId: savedPayment.id,
        amount,
        currency,
        serviceType,
        userId,
        projectId,
        metadata: paymentMetadata,
      });
    }

    return savedPayment;
  }

  /**
   * Obtiene un pago por ID
   */
  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException(`Pago no encontrado: ${id}`);
    }

    return payment;
  }

  /**
   * Verifica el estado de un pago con el proveedor
   */
  async verifyPayment(id: string): Promise<Payment> {
    const payment = await this.getPaymentById(id);
    const adapter = this.providers.get(payment.provider);

    if (!adapter) {
      throw new BadRequestException(`Proveedor no encontrado: ${payment.provider}`);
    }

    // Verificar estado con el proveedor
    const status = await adapter.verifyPayment(payment.providerPaymentId);

    // Actualizar estado en base de datos
    payment.status = status.status;
    return await this.paymentRepository.save(payment);
  }

  /**
   * Procesa un reembolso
   */
  async refundPayment(id: string, amount?: number): Promise<Payment> {
    const payment = await this.getPaymentById(id);
    const adapter = this.providers.get(payment.provider);

    if (!adapter) {
      throw new BadRequestException(`Proveedor no encontrado: ${payment.provider}`);
    }

    // Procesar reembolso
    const refundResult = await adapter.refundPayment(payment.providerPaymentId, amount);

    if (refundResult.success) {
      payment.status = 'refunded';
      await this.paymentRepository.save(payment);

      // Notificar a partners
      await this.webhookService.notifyPartners('service.refunded', {
        paymentId: payment.id,
        refundId: refundResult.refundId,
        amount: refundResult.amount,
      });
    }

    return payment;
  }

  /**
   * Lista todos los pagos (con filtros opcionales)
   */
  async listPayments(
    userId?: string,
    projectId?: string,
    status?: string,
  ): Promise<Payment[]> {
    const query = this.paymentRepository.createQueryBuilder('payment');

    if (userId) {
      query.andWhere('payment.userId = :userId', { userId });
    }

    if (projectId) {
      query.andWhere('payment.projectId = :projectId', { projectId });
    }

    if (status) {
      query.andWhere('payment.status = :status', { status });
    }

    query.orderBy('payment.createdAt', 'DESC');

    return await query.getMany();
  }
}
