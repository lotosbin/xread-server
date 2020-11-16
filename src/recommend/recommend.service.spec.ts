import { Test, TestingModule } from '@nestjs/testing';
import { RecommendService } from './recommend.service';
import { RecommendBaiduService } from './recommend-baidu.service';

describe('RecommendService', () => {
    let service: RecommendService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: RecommendService,
                    useClass: RecommendBaiduService,
                },
            ],
        }).compile();

        service = module.get<RecommendService>(RecommendService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
