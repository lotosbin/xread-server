
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class ArticleInput {
    keyword?: string;
    score?: number;
}

export class PageInput {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}

export interface Node {
    id: string;
}

export class Article implements Node {
    id: string;
    title?: string;
    summary?: string;
    link?: string;
    time?: string;
    feed?: Feed;
    tags?: string[];
    topic?: string;
    box?: string;
    priority: number;
    series?: Series;
}

export class ArticleConnection {
    pageInfo: PageInfo;
    edges: ArticleEdge[];
}

export class ArticleEdge {
    cursor: string;
    node: Article;
}

export class Feed implements Node {
    id: string;
    link: string;
    title?: string;
    articles?: ArticleConnection;
}

export class FeedConnection {
    pageInfo: PageInfo;
    edges: FeedEdge[];
}

export class FeedEdge {
    cursor: string;
    node: Feed;
}

export abstract class IMutation {
    abstract addArticle(title?: string, summary?: string, link?: string, time?: string, feedId?: string): Article | Promise<Article>;

    abstract addFeed(link: string, title?: string): Feed | Promise<Feed>;

    abstract markReaded(id?: string): Article | Promise<Article>;

    abstract markReadedBatch(ids?: string[]): Article[] | Promise<Article[]>;

    abstract markSpam(id?: string): Article | Promise<Article>;

    abstract markSpamBatch(ids?: string[]): Article[] | Promise<Article[]>;
}

export class PageInfo {
    startCursor?: string;
    endCursor?: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export abstract class IQuery {
    abstract recommend_articles(first?: number, after?: string, last?: number, before?: string): ArticleConnection | Promise<ArticleConnection>;

    abstract articles(first?: number, after?: string, last?: number, before?: string, box?: string, read?: string, priority?: number, search?: ArticleInput): ArticleConnection | Promise<ArticleConnection>;

    abstract viewer(): Viewer | Promise<Viewer>;

    abstract node(id: string, type?: string): Node | Promise<Node>;

    abstract feeds(first?: number, after?: string, last?: number, before?: string): FeedConnection | Promise<FeedConnection>;

    abstract tags(): TagConnection | Promise<TagConnection>;

    abstract topics(): TopicConnection | Promise<TopicConnection>;

    abstract series(page?: PageInput): SeriesConnection | Promise<SeriesConnection>;
}

export class Series implements Node {
    id: string;
    title: string;
    articles?: ArticleConnection;
}

export class SeriesConnection {
    pageInfo: PageInfo;
    edges: SeriesEdge[];
}

export class SeriesEdge {
    cursor: string;
    node: Series;
}

export abstract class ISubscription {
    abstract articleAdded(): Article | Promise<Article>;

    abstract feedAdded(): Feed | Promise<Feed>;
}

export class Tag implements Node {
    id: string;
    name: string;
    articles?: ArticleConnection;
}

export class TagConnection {
    pageInfo: PageInfo;
    edges: TagEdge[];
}

export class TagEdge {
    cursor: string;
    node: Tag;
}

export class Topic implements Node {
    id: string;
    name: string;
    articles?: ArticleConnection;
}

export class TopicConnection {
    pageInfo: PageInfo;
    edges: TopicEdge[];
}

export class TopicEdge {
    cursor: string;
    node: Topic;
}

export class Viewer {
    recommend_articles?: ArticleConnection;
    username?: string;
}
