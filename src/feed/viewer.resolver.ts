import { Args, Query, Resolver } from '@nestjs/graphql';
import { ArticleConnection } from '../graphql';
import { makeConnection } from '../relay';

@Resolver('Viewer')
export class ViewerResolver {
    @Query('viewer')
    async viewer() {
        return {};
    }

    @Query()
    async recommend_articles(@Args() args: any): Promise<ArticleConnection> {
        // this.logger.log(`recommend_articles`);
        // return await makeConnection(args => this.feedRecommendService.getArticles(args))({ ...args });
        return {} as any;
    }
}
