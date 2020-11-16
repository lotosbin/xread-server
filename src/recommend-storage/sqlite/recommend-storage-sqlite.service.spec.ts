import { Test, TestingModule } from '@nestjs/testing';
import { RecommendStorageSqliteService } from './recommend-storage-sqlite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendEntity } from './entities/recommend.entity';

describe('RecommendStorageSqliteService', () => {
    let service: RecommendStorageSqliteService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'db',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([RecommendEntity]),
            ],
            providers: [Repository, RecommendStorageSqliteService],
        }).compile();

        service = module.get<RecommendStorageSqliteService>(RecommendStorageSqliteService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should remove by feed_id be correct', async () => {
        expect(service).toBeDefined();
        await service.removeBy(311);
    });
});
