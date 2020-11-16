import { Module } from '@nestjs/common';
import { ViewerResolver } from './viewer.resolver';
import { FeedRecommendService } from './feed-recommend.service';
import { QueryResolver } from './query.resolver';

@Module({
    providers: [
        FeedRecommendService,
        ViewerResolver,
        QueryResolver,
    ],
})
export class FeedRecommendModule {
}
