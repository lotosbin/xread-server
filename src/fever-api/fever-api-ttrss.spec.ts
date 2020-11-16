import { Test, TestingModule } from '@nestjs/testing';
import { RecommendService } from '../recommend/recommend.service';
import { TTRssFeverApi } from './fever-api-ttrss';

describe('RecommendService', () => {
    let api: TTRssFeverApi;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TTRssFeverApi],
        }).compile();

        api = module.get<TTRssFeverApi>(TTRssFeverApi);
    });

    it('should be defined', () => {
        expect(api).toBeDefined();
    });
    it(
        'items should be correct',
        async () => {
            const result = await api.items({ since_id: 9018 });
            expect(result).toBeDefined();
        },
        60 * 1000,
    );
    it('should unread_item_ids', async () => {
        const result = await api.unread_item_ids();
        expect(result.unread_item_ids).toBeDefined();
    });
});
