import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { Partner } from '../entities/partner.entity';
import { HmacService } from '../common/services/hmac.service';

@Module({
  imports: [TypeOrmModule.forFeature([Partner])],
  controllers: [PartnerController],
  providers: [PartnerService, HmacService],
  exports: [PartnerService, HmacService],
})
export class PartnerModule { }
