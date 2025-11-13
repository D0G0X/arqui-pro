import { Test, TestingModule } from '@nestjs/testing';
import { AvancesGateway } from './avances.gateway';
import { AvancesService } from './avances.service';

describe('AvancesGateway', () => {
  let gateway: AvancesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvancesGateway, AvancesService],
    }).compile();

    gateway = module.get<AvancesGateway>(AvancesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
