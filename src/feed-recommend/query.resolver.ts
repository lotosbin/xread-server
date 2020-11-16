import { Args, Query, Resolver } from '@nestjs/graphql';
import { ArticleConnection } from '../graphql';
import { makeConnection } from '../relay';
import { Logger } from '@nestjs/common';
import { FeedRecommendService } from './feed-recommend.service';

@Resolver('Query')
export class QueryResolver {
    private logger = new Logger(QueryResolver.name);

    constructor(private feedRecommendService: FeedRecommendService) {}

    @Query()
    async recommend_articles(@Args() args: any): Promise<ArticleConnection> {
        this.logger.log(`recommend_articles`);
        return await makeConnection(args => this.feedRecommendService.getArticles(args))({ ...args });
    }
}
