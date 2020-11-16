import { Injectable } from '@nestjs/common';

export type TFeed = {
    id: string;
};

export type TPage = {
    first: number;
    after: string;
    last: number;
    before: string;
};
export type TGetArticlesArgs = {
    first: number;
    after: string;
    last: number;
    before: string;
    feedId: string;
    tag: string;
    topic: string;
    box: string;
    read: string;
    priority: number | null;

    search: {
        keyword: string | null;
        score: number;
    };
    seriesId: string | null;
};

export type TAddArticleArgs = {
    link: string;
    title: string;
    summary: string;
    time: string;
    feedId: string;
};
export type TSeries = {
    _id: string;
    title: string;
};

export type TId = { id: string };

export type TArticle = {
    extra: any;
    id: string;
    feed: {
        title: string;
    };
    summary: string | null;
    title: string;
    feedId: string | null;
    tags: Array<string>;
    priority: number;
    spam: boolean;
    /*@FlowDeprecated use seriesId2*/
    seriesId: string;
    seriesId2: string;
};

export interface IDBArticle extends TArticle {
    _id: string;
}

@Injectable()
export abstract class FeedService {
    abstract getFeed(id: string | null): Promise<TFeed | null>;

    abstract getArticles(args: TGetArticlesArgs): Promise<TArticle[]>;

    abstract getFeeds({ first, after, last, before }: TPage): Promise<TFeed[]>;

    abstract getTopics(): Promise<Array<{ id: string; name: string }>>;

    abstract getTags(): Promise<Array<{ id: string; name: string }>>;

    abstract addFeed({ link, title }: { link: string; title: string }): Promise<any>;

    abstract readArticle({ id }: TId): Promise<TArticle>;

    abstract markArticleSpam({ id }: TId): Promise<any>;

    abstract addArticle({ link, title, summary, time, feedId }: TAddArticleArgs): Promise<TArticle | null>;
}
