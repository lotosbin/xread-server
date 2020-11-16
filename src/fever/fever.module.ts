import { Module } from '@nestjs/common';
import { FeverController } from './fever.controller';
import { FeverApiModule } from '../fever-api/fever-api.module';
import { RecommendModule } from '../recommend/recommend.module';

@Module({
    imports: [
        FeverApiModule,
        RecommendModule,
    ],
    providers: [],
    controllers: [
        FeverController,
    ],
})
export class FeverModule {
}
