import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from '../entities/partner.entity';
import { HmacService } from '../common/services/hmac.service';
import { RegisterPartnerDto } from './dto/register-partner.dto';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    private hmacService: HmacService,
  ) {}

  /**
   * Registra un nuevo partner B2B
   */
  async registerPartner(dto: RegisterPartnerDto): Promise<Partner> {
    // Validar que la URL del webhook sea válida
    try {
      new URL(dto.webhookUrl);
    } catch (error) {
      throw new BadRequestException('URL de webhook inválida');
    }

    // Validar que los eventos sean válidos
    const validEvents = [
      'service.purchased',
      'service.refunded',
      'appointment.confirmed',
      'appointment.cancelled',
      'project.completed',
      'project.updated',
    ];

    const invalidEvents = dto.subscribedEvents.filter(
      (event) => !validEvents.includes(event),
    );

    if (invalidEvents.length > 0) {
      throw new BadRequestException(
        `Eventos inválidos: ${invalidEvents.join(', ')}. Eventos válidos: ${validEvents.join(', ')}`,
      );
    }

    // Generar secret compartido si no se proporciona
    const secret = dto.secret || this.hmacService.generateSecret();

    // Verificar si ya existe un partner con el mismo nombre
    const existingPartner = await this.partnerRepository.findOne({
      where: { name: dto.name },
    });

    if (existingPartner) {
      throw new BadRequestException(`Ya existe un partner con el nombre: ${dto.name}`);
    }

    // Crear partner
    const partner = this.partnerRepository.create({
      name: dto.name,
      webhookUrl: dto.webhookUrl,
      secret,
      subscribedEvents: dto.subscribedEvents,
      description: dto.description,
      isActive: true,
    });

    return await this.partnerRepository.save(partner);
  }

  /**
   * Obtiene un partner por ID
   */
  async getPartnerById(id: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({ where: { id } });

    if (!partner) {
      throw new NotFoundException(`Partner no encontrado: ${id}`);
    }

    return partner;
  }

  /**
   * Lista todos los partners activos
   */
  async listPartners(includeInactive: boolean = false): Promise<Partner[]> {
    const query = this.partnerRepository.createQueryBuilder('partner');

    if (!includeInactive) {
      query.where('partner.isActive = :isActive', { isActive: true });
    }

    query.orderBy('partner.createdAt', 'DESC');

    return await query.getMany();
  }

  /**
   * Actualiza un partner
   */
  async updatePartner(
    id: string,
    updates: Partial<RegisterPartnerDto>,
  ): Promise<Partner> {
    const partner = await this.getPartnerById(id);

    if (updates.webhookUrl) {
      try {
        new URL(updates.webhookUrl);
      } catch (error) {
        throw new BadRequestException('URL de webhook inválida');
      }
      partner.webhookUrl = updates.webhookUrl;
    }

    if (updates.subscribedEvents) {
      partner.subscribedEvents = updates.subscribedEvents;
    }

    if (updates.description !== undefined) {
      partner.description = updates.description;
    }

    if (updates.name) {
      // Verificar que el nuevo nombre no esté en uso
      const existingPartner = await this.partnerRepository.findOne({
        where: { name: updates.name },
      });

      if (existingPartner && existingPartner.id !== id) {
        throw new BadRequestException(`Ya existe un partner con el nombre: ${updates.name}`);
      }

      partner.name = updates.name;
    }

    return await this.partnerRepository.save(partner);
  }

  /**
   * Activa/desactiva un partner
   */
  async togglePartnerStatus(id: string, isActive: boolean): Promise<Partner> {
    const partner = await this.getPartnerById(id);
    partner.isActive = isActive;
    return await this.partnerRepository.save(partner);
  }

  /**
   * Elimina un partner
   */
  async deletePartner(id: string): Promise<void> {
    const partner = await this.getPartnerById(id);
    await this.partnerRepository.remove(partner);
  }

  /**
   * Obtiene partners suscritos a un evento específico
   */
  async getPartnersSubscribedToEvent(eventType: string): Promise<Partner[]> {
    return await this.partnerRepository
      .createQueryBuilder('partner')
      .where('partner.isActive = :isActive', { isActive: true })
      .andWhere(':eventType = ANY(partner.subscribedEvents)', { eventType })
      .getMany();
  }
}
