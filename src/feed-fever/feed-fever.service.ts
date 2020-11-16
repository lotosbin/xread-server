import { Injectable } from '@nestjs/common';
import { FeedService, TAddArticleArgs, TArticle, TFeed, TGetArticlesArgs, TId, TPage } from '../feed/feed.service';

@Injectable()
export class FeedFeverService extends FeedService {
    getFeed(id: string | null): Promise<TFeed | null> {
        //todo
        return Promise.resolve(undefined);
    }

    addArticle({ link, title, summary, time, feedId }: TAddArticleArgs): Promise<TArticle | null> {
        return Promise.resolve(undefined);
    }

    addFeed({ link, title }: { link: string; title: string }): Promise<any> {
        return Promise.resolve(undefined);
    }

    getArticles(args: TGetArticlesArgs): Promise<TArticle[]> {
        return Promise.resolve([]);
    }

    getFeeds({ first, after, last, before }: TPage): Promise<TFeed[]> {
        return Promise.resolve([]);
    }

    getTags(): Promise<Array<{ id: string; name: string }>> {
        return Promise.resolve(undefined);
    }

    getTopics(): Promise<Array<{ id: string; name: string }>> {
        return Promise.resolve(undefined);
    }

    markArticleSpam({ id }: TId): Promise<any> {
        return Promise.resolve(undefined);
    }

    readArticle({ id }: TId): Promise<TArticle> {
        return Promise.resolve(undefined);
    }
}
