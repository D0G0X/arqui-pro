import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IncomingWebhookDto {
  @ApiProperty({
    description: 'Datos del webhook recibido',
    example: { projectId: '123', status: 'completed' },
  })
  @IsObject()
  data: Record<string, any>;
}
