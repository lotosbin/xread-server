import { Test, TestingModule } from '@nestjs/testing';
import { FeedLocalService } from './feed-local.service';

describe('FeedLocalService', () => {
    let service: FeedLocalService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FeedLocalService],
        }).compile();

        service = module.get<FeedLocalService>(FeedLocalService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
