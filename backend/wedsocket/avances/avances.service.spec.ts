import { Test, TestingModule } from '@nestjs/testing';
import { AvancesService } from './avances.service';

describe('AvancesService', () => {
  let service: AvancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvancesService],
    }).compile();

    service = module.get<AvancesService>(AvancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
