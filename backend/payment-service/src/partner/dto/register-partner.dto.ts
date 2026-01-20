import { IsString, IsArray, IsOptional, IsUrl, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterPartnerDto {
  @ApiProperty({
    description: 'Nombre del partner (debe ser único)',
    example: 'Cursor Online',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL del webhook donde se enviarán los eventos',
    example: 'https://cursor-online.com/api/webhooks',
  })
  @IsUrl({}, { message: 'webhookUrl debe ser una URL válida' })
  webhookUrl: string;

  @ApiProperty({
    description: 'Eventos a los que se suscribe el partner',
    example: ['service.purchased', 'appointment.confirmed'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe suscribirse al menos a un evento' })
  @IsString({ each: true })
  subscribedEvents: string[];

  @ApiPropertyOptional({
    description: 'Secret compartido para firmar webhooks (se genera automáticamente si no se proporciona)',
    example: 'my-secret-key-here',
  })
  @IsOptional()
  @IsString()
  secret?: string;

  @ApiPropertyOptional({
    description: 'Descripción del partner',
    example: 'Sistema de gestión de citas online',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
