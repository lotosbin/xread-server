import { Module } from '@nestjs/common';
import { FeverRecommendController } from './fever-recommend.controller';
import { RecommendModule } from '../recommend/recommend.module';
import { RecommendStorageModule } from '../recommend-storage/recommend-storage.module';
import { FeverApiModule } from '../fever-api/fever-api.module';

@Module({
    imports: [
        FeverApiModule,
        RecommendModule,
        RecommendStorageModule,
    ],
    providers: [
        FeverRecommendController,
    ],
})
export class FeverRecommendModule {
}
