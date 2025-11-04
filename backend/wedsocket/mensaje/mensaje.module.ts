import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MensajeGateway } from './mensaje.gateway';
import { MensajeService } from './mensaje.service';
import { MensajeController } from './mensaje.controller';

@Module({
  imports: [HttpModule],
  controllers: [MensajeController],
  providers: [MensajeGateway, MensajeService],
  exports: [MensajeService],
})
export class MensajeModule {}