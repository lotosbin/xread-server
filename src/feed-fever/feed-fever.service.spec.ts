import { Test, TestingModule } from '@nestjs/testing';
import { FeedFeverService } from './feed-fever.service';

describe('FeedFeverService', () => {
    let service: FeedFeverService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FeedFeverService],
        }).compile();

        service = module.get<FeedFeverService>(FeedFeverService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
