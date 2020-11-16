import { Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { makeConnection } from '../relay';
import { FeedService, TArticle } from './feed.service';
import { ARTICLE_ADDED, pubsub } from './common';

@Resolver('Article')
export class ArticleResolver {
    constructor(private feedService: FeedService) {}

    @Subscription()
    articleAdded() {
        return pubsub.asyncIterator([ARTICLE_ADDED]);
    }

    @Query()
    async articles(parent: any, args: any, context: any) {
        return await makeConnection(args => this.feedService.getArticles(args))(args);
    }

    @ResolveField()
    id(parent: any) {
        return parent._id;
    }

    @ResolveField()
    summary({ summary }: TArticle) {
        return (summary || '').replace(/<[^>]+>/g, '');
    }

    @ResolveField()
    async feed({ feedId }: TArticle, args: any, {}) {
        return await this.feedService.getFeed(feedId);
    }

    @ResolveField()
    async tags(article: TArticle) {
        if (article.tags) {
            return article.tags;
        }
        return [];
    }

    @ResolveField()
    async priority(article: TArticle) {
        return article.priority ? article.priority : 0;
    }

    @ResolveField()
    async box(article: TArticle) {
        if (article.spam) return 'spam';
        return 'inbox';
    }

    @ResolveField()
    async series({ seriesId2: seriesId }: TArticle, args: any, context: any): Promise<any | null> {
        console.log(`seriesId2:${seriesId}`);
        if (!seriesId) {
            return null;
        }
        return {
            _id: seriesId,
            title: seriesId,
        };
    }
}
