import { IsString, IsNumber, IsOptional, IsObject, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Proveedor de pago a usar',
    example: 'mock',
    enum: ['mock', 'stripe'],
  })
  @IsString()
  provider: string;

  @ApiProperty({
    description: 'Monto a pagar',
    example: 100.50,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Moneda del pago',
    example: 'USD',
    default: 'USD',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Tipo de servicio pagado',
    example: 'asesoria_tecnica',
  })
  @IsString()
  serviceType: string;

  @ApiPropertyOptional({
    description: 'ID del usuario que realiza el pago',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'ID del proyecto relacionado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'Metadatos adicionales del pago',
    example: { description: 'Asesoría técnica para proyecto X' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
