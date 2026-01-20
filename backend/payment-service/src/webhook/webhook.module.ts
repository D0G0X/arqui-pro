import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { WebhookEvent } from '../entities/webhook-event.entity';
import { PartnerModule } from '../partner/partner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebhookEvent]),
    HttpModule,
    PartnerModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule { }
