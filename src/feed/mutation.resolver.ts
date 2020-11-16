import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { ARTICLE_ADDED, FEED_ADDED, pubsub } from './common';
import { FeedService } from './feed.service';
import { StoreService } from '../store/store.service';

@Resolver('Mutation')
export class MutationResolver {
    constructor(private feedService: FeedService, private storeService: StoreService) {}

    @ResolveField()
    async addArticle(@Args() args) {
        let article = await this.feedService.addArticle(args);
        if (!article) return null;
        if (!article.extra.updatedExisting) {
            pubsub.publish(ARTICLE_ADDED, { articleAdded: article });
        }
        return article;
    }

    @ResolveField()
    async addFeed(root: any, @Args() args: any, context: any) {
        let feed = await this.feedService.addFeed(args);
        pubsub.publish(FEED_ADDED, { feedAdded: feed });
        if (feed) {
            this.storeService.addFeedToStore(feed);
        }
        return feed;
    }

    @ResolveField()
    async markReaded(root: any, @Args() args: any, context: any) {
        return await this.feedService.readArticle(args);
    }

    @ResolveField()
    async markReadedBatch(root: any, @Args() args: any, context: any) {
        let { ids = [] } = args;
        return Promise.all(
            ids.map(async id => {
                return await this.feedService.readArticle({ id });
            }),
        );
    }

    @ResolveField()
    async markSpam(root: any, @Args() args: any, context: any) {
        return await this.feedService.markArticleSpam(args);
    }

    @ResolveField()
    async markSpamBatch(root: any, @Args() args: any, context: any) {
        let { ids = [] } = args;
        return Promise.all(
            ids.map(async id => {
                return await this.feedService.markArticleSpam({ id });
            }),
        );
    }
}
