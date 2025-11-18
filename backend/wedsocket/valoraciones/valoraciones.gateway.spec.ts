import { Test, TestingModule } from '@nestjs/testing';
import { ValoracionesGateway } from './valoraciones.gateway';
import { ValoracionesService } from './valoraciones.service';

describe('ValoracionesGateway', () => {
  let gateway: ValoracionesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValoracionesGateway, ValoracionesService],
    }).compile();

    gateway = module.get<ValoracionesGateway>(ValoracionesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
