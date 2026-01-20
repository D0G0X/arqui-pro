import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from '../entities/payment.entity';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Procesar un nuevo pago' })
  @ApiResponse({ status: 201, description: 'Pago procesado exitosamente', type: Payment })
  @ApiResponse({ status: 400, description: 'Datos inválidos o proveedor no soportado' })
  async createPayment(@Body() dto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentService.processPayment(
      dto.provider,
      dto.amount,
      dto.currency,
      dto.serviceType,
      dto.userId,
      dto.projectId,
      dto.metadata,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago por ID' })
  @ApiResponse({ status: 200, description: 'Pago encontrado', type: Payment })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async getPayment(@Param('id') id: string): Promise<Payment> {
    return await this.paymentService.getPaymentById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagos con filtros opcionales' })
  @ApiResponse({ status: 200, description: 'Lista de pagos', type: [Payment] })
  async listPayments(
    @Query('userId') userId?: string,
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
  ): Promise<Payment[]> {
    return await this.paymentService.listPayments(userId, projectId, status);
  }

  @Patch(':id/verify')
  @ApiOperation({ summary: 'Verificar el estado de un pago con el proveedor' })
  @ApiResponse({ status: 200, description: 'Estado verificado', type: Payment })
  async verifyPayment(@Param('id') id: string): Promise<Payment> {
    return await this.paymentService.verifyPayment(id);
  }

  @Patch(':id/refund')
  @ApiOperation({ summary: 'Procesar un reembolso' })
  @ApiResponse({ status: 200, description: 'Reembolso procesado', type: Payment })
  async refundPayment(
    @Param('id') id: string,
    @Body('amount') amount?: number,
  ): Promise<Payment> {
    return await this.paymentService.refundPayment(id, amount);
  }
}
