import { Args, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { makeConnection } from '../relay';
import { FeedService } from './feed.service';
import { FEED_ADDED, pubsub } from './common';

@Resolver('Feed')
export class FeedResolver {
    constructor(private feedService: FeedService) {}

    @Subscription()
    feedAdded() {
        return pubsub.asyncIterator([FEED_ADDED]);
    }

    @Query()
    async feeds(parent: any, args: any, context: any) {
        return await makeConnection(args => this.feedService.getFeeds(args))(args);
    }

    @ResolveField()
    id(@Parent() parent: any) {
        return parent._id;
    }

    @ResolveField()
    async articles(@Parent() parent: any, @Args() args: any, context: any) {
        return await makeConnection(args => this.feedService.getArticles(args))({ ...args, feedId: parent.id });
    }
}
