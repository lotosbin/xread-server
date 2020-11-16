import { Test, TestingModule } from '@nestjs/testing';
import { FeverRecommendController } from './fever-recommend.controller';

describe('FeverRecommend Controller', () => {
    let controller: FeverRecommendController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FeverRecommendController],
        }).compile();

        controller = module.get<FeverRecommendController>(FeverRecommendController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
