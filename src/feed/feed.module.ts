import { Module } from '@nestjs/common';
import { FeedResolver } from './feed.resolver';
import { ArticleResolver } from './article.resolver';
import { MutationResolver } from './mutation.resolver';
import { FeedService } from './feed.service';
import { SeriesService } from './series.service';
import { ArticleService } from './article.service';
import { TagResolver } from './tag.resolver';
import { TopicResolver } from './topic.resolver';
import { SeriesResolver } from './series.resolver';
import { NodeResolver } from './node.resolver';
import { StoreModule } from '../store/store.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeedLocalService } from '../feed-local/feed-local.service';
import { ViewerResolver } from './viewer.resolver';

@Module({
    imports: [StoreModule, ConfigModule],
    providers: [ConfigService, FeedResolver, ArticleResolver, MutationResolver, { provide: FeedService, useClass: FeedLocalService }, SeriesService, ArticleService, TagResolver, TopicResolver, SeriesResolver, NodeResolver, ViewerResolver],
})
export class FeedModule {}
