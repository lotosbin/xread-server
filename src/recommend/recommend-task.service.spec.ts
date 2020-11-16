import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { RecommendTaskService } from './recommend-task.service';
import { RecommendService } from './recommend.service';
import { RecommendBaiduService } from './recommend-baidu.service';
import { RecommendStorageService } from '../recommend-storage/recommend-storage.service';
import { RecommendStorageSqliteService } from '../recommend-storage/sqlite/recommend-storage-sqlite.service';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeverApi } from '../fever/fever-api';
import { TTRssFeverApi } from '../fever/fever-api-ttrss';
import { Client } from 'baidu-aip-easedl/lib';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../config/configuration';

describe('RecommendTaskService', () => {
    let service: RecommendTaskService;
    let api: FeverApi;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration],
                }),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'db',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                }),
            ],
            providers: [
                { provide: RecommendService, useClass: RecommendBaiduService },
                {
                    provide: RecommendStorageService,
                    useClass: RecommendStorageSqliteService,
                },
                RecommendTaskService,
                Repository,
                RecommendStorageSqliteService,
                {
                    provide: Client,
                    useFactory: (config: ConfigService) => new Client(config.get<string>('BAIDU_AIP_EASEDL_API_KEY'), config.get<string>('BAIDU_AIP_EASEDL_SECRET_KEY')),
                    inject: [ConfigService],
                },
                { provide: FeverApi, useClass: TTRssFeverApi },
            ],
        }).compile();

        service = module.get<RecommendTaskService>(RecommendTaskService);
        api = module.get<FeverApi>(FeverApi);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(api).toBeDefined();
    });
    it(
        'should be correct',
        async () => {
            await service.parse();
        },
        150 * 1000,
    );
});
