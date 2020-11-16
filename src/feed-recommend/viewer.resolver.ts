import { Args, Query, Resolver } from '@nestjs/graphql';
import { ArticleConnection} from '../graphql';
import { makeConnection } from '../relay';
import { Logger } from '@nestjs/common';
import { FeedRecommendService } from './feed-recommend.service';

@Resolver('Viewer')
export class ViewerResolver {
    private logger = new Logger(ViewerResolver.name);

    constructor(
        private feedRecommendService: FeedRecommendService,
    ) {
    }

    @Query('viewer')
    async viewer() {
        return {};
    }

    async recommend_articles(@Args() args: any): Promise<ArticleConnection> {
        this.logger.log(`recommend_articles`);
        return await makeConnection(args => this.feedRecommendService.getArticles(args))({ ...args });
    }
}
