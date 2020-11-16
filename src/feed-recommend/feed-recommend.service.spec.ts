import { Test, TestingModule } from '@nestjs/testing';
import { FeedRecommendService } from './feed-recommend.service';

describe('FeedRecommendService', () => {
    let service: FeedRecommendService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FeedRecommendService],
        }).compile();

        service = module.get<FeedRecommendService>(FeedRecommendService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
