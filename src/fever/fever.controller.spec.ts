import { Test, TestingModule } from '@nestjs/testing';
import { FeverController } from './fever.controller';

describe('Fever Controller', () => {
    let controller: FeverController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FeverController],
        }).compile();

        controller = module.get<FeverController>(FeverController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
