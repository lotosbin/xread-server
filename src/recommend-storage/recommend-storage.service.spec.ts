import { Test, TestingModule } from '@nestjs/testing';
import { RecommendStorageService } from './recommend-storage.service';
import { RecommendStorageSqliteService } from './sqlite/recommend-storage-sqlite.service';
import { Repository } from 'typeorm';

describe('StorageService', () => {
    let service: RecommendStorageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: RecommendStorageService,
                    useClass: RecommendStorageSqliteService,
                },
                Repository,
            ],
        }).compile();

        service = module.get<RecommendStorageService>(RecommendStorageService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('findAll', async () => {
        let entities = await service.findAll();
        expect(entities.length > 0).toBeTruthy();
    });
});
