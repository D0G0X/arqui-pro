import { Injectable } from '@nestjs/common';
import {
  PaymentProvider,
  PaymentResult,
  PaymentStatus,
  RefundResult,
} from '../interfaces/payment-provider.interface';

/**
 * MockAdapter - Adaptador para desarrollo y testing
 * 
 * Simula el procesamiento de pagos sin realizar transacciones reales
 */
@Injectable()
export class MockAdapter implements PaymentProvider {
  private payments: Map<string, PaymentStatus> = new Map();

  async processPayment(
    amount: number,
    currency: string,
    metadata: Record<string, any>,
  ): Promise<PaymentResult> {
    // Simular delay de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 500));

    const paymentId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const providerPaymentId = `mock_provider_${paymentId}`;

    // Simular éxito o fallo aleatorio (90% éxito para testing)
    const success = Math.random() > 0.1;
    const status = success ? 'completed' : 'failed';

    const paymentStatus: PaymentStatus = {
      paymentId: providerPaymentId,
      status,
      amount,
      currency,
      metadata,
    };

    this.payments.set(providerPaymentId, paymentStatus);

    return {
      success,
      paymentId,
      providerPaymentId,
      status,
      message: success
        ? 'Pago procesado exitosamente (Mock)'
        : 'Error simulado en el procesamiento del pago',
      metadata,
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentStatus> {
    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const payment = this.payments.get(paymentId);

    if (!payment) {
      throw new Error(`Pago no encontrado: ${paymentId}`);
    }

    return payment;
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<RefundResult> {
    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const payment = this.payments.get(paymentId);

    if (!payment) {
      throw new Error(`Pago no encontrado: ${paymentId}`);
    }

    const refundAmount = amount || payment.amount;
    const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Actualizar estado del pago
    payment.status = 'refunded';
    this.payments.set(paymentId, payment);

    return {
      success: true,
      refundId,
      amount: refundAmount,
      message: `Reembolso procesado exitosamente (Mock): ${refundAmount} ${payment.currency}`,
    };
  }
}
