import { Test, TestingModule } from '@nestjs/testing';
import { IncidenciasGateway } from './incidencias.gateway';
import { IncidenciasService } from './incidencias.service';

describe('IncidenciasGateway', () => {
  let gateway: IncidenciasGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidenciasGateway, IncidenciasService],
    }).compile();

    gateway = module.get<IncidenciasGateway>(IncidenciasGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
