import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { makeConnection } from '../relay';
import { FeedService, TSeries } from './feed.service';
import { SeriesService } from './series.service';
import { ArticleConnection } from '../graphql';

@Resolver('Series')
export class SeriesResolver {
    constructor(private feedService: FeedService, private seriesService: SeriesService) {}

    @Query()
    async series(@Parent() parent: any, @Args() args: any) {
        return await makeConnection(args => this.seriesService.getSeries())(args);
    }

    @ResolveField()
    id(@Parent() parent: any) {
        return parent._id;
    }

    @ResolveField()
    async articles(@Parent() series: TSeries, @Args() args: any): Promise<ArticleConnection> {
        return makeConnection(args => this.feedService.getArticles(args))({
            ...args,
            ...args.page,
            seriesId: series._id,
        });
    }
}
