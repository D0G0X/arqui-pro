import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PartnerService } from './partner.service';
import { RegisterPartnerDto } from './dto/register-partner.dto';
import { Partner } from '../entities/partner.entity';

@ApiTags('partners')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo partner B2B' })
  @ApiResponse({ status: 201, description: 'Partner registrado exitosamente', type: Partner })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async registerPartner(@Body() dto: RegisterPartnerDto): Promise<Partner> {
    return await this.partnerService.registerPartner(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los partners' })
  @ApiResponse({ status: 200, description: 'Lista de partners', type: [Partner] })
  async listPartners(
    @Query('includeInactive') includeInactive?: string,
  ): Promise<Partner[]> {
    return await this.partnerService.listPartners(includeInactive === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un partner por ID' })
  @ApiResponse({ status: 200, description: 'Partner encontrado', type: Partner })
  @ApiResponse({ status: 404, description: 'Partner no encontrado' })
  async getPartner(@Param('id') id: string): Promise<Partner> {
    return await this.partnerService.getPartnerById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un partner' })
  @ApiResponse({ status: 200, description: 'Partner actualizado', type: Partner })
  async updatePartner(
    @Param('id') id: string,
    @Body() updates: Partial<RegisterPartnerDto>,
  ): Promise<Partner> {
    return await this.partnerService.updatePartner(id, updates);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activar/desactivar un partner' })
  @ApiResponse({ status: 200, description: 'Estado actualizado', type: Partner })
  async togglePartnerStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ): Promise<Partner> {
    return await this.partnerService.togglePartnerStatus(id, isActive);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un partner' })
  @ApiResponse({ status: 204, description: 'Partner eliminado' })
  async deletePartner(@Param('id') id: string): Promise<void> {
    return await this.partnerService.deletePartner(id);
  }
}
