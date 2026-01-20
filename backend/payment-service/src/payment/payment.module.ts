import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from '../entities/payment.entity';
import { MockAdapter } from './adapters/mock-adapter';
import { StripeAdapter } from './adapters/stripe-adapter';
import { WebhookModule } from '../webhook/webhook.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    WebhookModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, MockAdapter, StripeAdapter],
  exports: [PaymentService],
})
export class PaymentModule { }
