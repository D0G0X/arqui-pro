import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoGateway } from './proyecto.gateway';
import { ProyectoService } from './proyecto.service';

describe('ProyectoGateway', () => {
  let gateway: ProyectoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProyectoGateway, ProyectoService],
    }).compile();

    gateway = module.get<ProyectoGateway>(ProyectoGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
