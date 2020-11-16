import { Test, TestingModule } from '@nestjs/testing';
import { TtrssController } from './ttrss.controller';

describe('Ttrss Controller', () => {
  let controller: TtrssController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtrssController],
    }).compile();

    controller = module.get<TtrssController>(TtrssController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
