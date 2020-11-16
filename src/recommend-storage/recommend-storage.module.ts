import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendEntity } from './sqlite/entities/recommend.entity';
import { GroupEntity } from './sqlite/entities/group.entity';
import { ConfigModule } from '@nestjs/config';
import { FeedEntity } from './sqlite/entities/feed.entity';
import { ItemEntity } from './sqlite/entities/item.entity';
import { RecommendStorageService } from './recommend-storage.service';
import { RecommendStorageSqliteService } from './sqlite/recommend-storage-sqlite.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            RecommendEntity,
            GroupEntity,
            FeedEntity,
            ItemEntity,
        ]),
        ConfigModule,
    ],
    providers: [
        {
            provide: RecommendStorageService,
            useClass: RecommendStorageSqliteService,
        },
    ],
    exports: [RecommendStorageService],
})
export class RecommendStorageModule {
}
