import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  PaymentProvider,
  PaymentResult,
  PaymentStatus,
  RefundResult,
} from '../interfaces/payment-provider.interface';

/**
 * StripeAdapter - Adaptador para procesar pagos con Stripe
 * 
 * Requiere configuración de STRIPE_SECRET_KEY en variables de entorno
 */
@Injectable()
export class StripeAdapter implements PaymentProvider {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!secretKey) {
      console.warn('[StripeAdapter] STRIPE_SECRET_KEY no configurada. El adaptador no funcionará correctamente.');
    } else {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2023-10-16' as any,
      });
    }
  }

  async processPayment(
    amount: number,
    currency: string,
    metadata: Record<string, any>,
  ): Promise<PaymentResult> {
    if (!this.stripe) {
      throw new Error('Stripe no está configurado. Verifica STRIPE_SECRET_KEY en las variables de entorno.');
    }

    try {
      // Convertir amount a centavos (Stripe usa centavos)
      const amountInCents = Math.round(amount * 100);

      // Crear PaymentIntent en Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Determinar estado basado en el PaymentIntent
      let status: 'pending' | 'completed' | 'failed' = 'pending';
      if (paymentIntent.status === 'succeeded') {
        status = 'completed';
      } else if (paymentIntent.status === 'canceled') {
        status = 'failed';
      }

      return {
        success: paymentIntent.status === 'succeeded',
        paymentId: paymentIntent.id,
        providerPaymentId: paymentIntent.id,
        status,
        message: `Pago procesado con Stripe: ${paymentIntent.status}`,
        metadata: {
          ...metadata,
          stripeStatus: paymentIntent.status,
          clientSecret: paymentIntent.client_secret,
        },
      };
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        providerPaymentId: '',
        status: 'failed',
        message: `Error procesando pago con Stripe: ${error.message}`,
        metadata,
      };
    }
  }

  async verifyPayment(paymentId: string): Promise<PaymentStatus> {
    if (!this.stripe) {
      throw new Error('Stripe no está configurado.');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

      let status: 'pending' | 'completed' | 'failed' | 'refunded' = 'pending';
      if (paymentIntent.status === 'succeeded') {
        status = 'completed';
      } else if (paymentIntent.status === 'canceled') {
        status = 'failed';
      }

      // Verificar si hay reembolsos
      if ((paymentIntent as any).amount_refunded > 0) {
        status = (paymentIntent as any).amount_refunded === paymentIntent.amount ? 'refunded' : 'completed';
      }

      return {
        paymentId: paymentIntent.id,
        status,
        amount: paymentIntent.amount / 100, // Convertir de centavos
        currency: paymentIntent.currency.toUpperCase(),
        metadata: paymentIntent.metadata as Record<string, any>,
      };
    } catch (error) {
      throw new Error(`Error verificando pago en Stripe: ${error.message}`);
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<RefundResult> {
    if (!this.stripe) {
      throw new Error('Stripe no está configurado.');
    }

    try {
      // Primero necesitamos obtener el PaymentIntent para acceder al charge
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

      if (!paymentIntent.latest_charge) {
        throw new Error('No se encontró el charge asociado al pago');
      }

      const chargeId = paymentIntent.latest_charge as string;

      // Crear el reembolso
      const refundParams: Stripe.RefundCreateParams = {
        charge: chargeId,
      };

      if (amount) {
        // Convertir a centavos
        refundParams.amount = Math.round(amount * 100);
      }

      const refund = await this.stripe.refunds.create(refundParams);

      return {
        success: refund.status === 'succeeded' || refund.status === 'pending',
        refundId: refund.id,
        amount: refund.amount / 100, // Convertir de centavos
        message: `Reembolso procesado con Stripe: ${refund.status}`,
      };
    } catch (error) {
      throw new Error(`Error procesando reembolso en Stripe: ${error.message}`);
    }
  }
}
