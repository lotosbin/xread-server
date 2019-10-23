
import {MongoClient, ObjectId} from "mongodb";
import assert from "assert";

import config from "./config";

export let mongoConnectionString: string = config.mongo;
type TFeed = {
    id: string;
}

export async function getFeed(id: string | null): Promise<TFeed | null> {
    if (!id) return null;
    const database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
    const result = await database.db("xread").collection("feed").findOne({_id: new ObjectId(id)});
    await database.close();
    if (result) result.id = result._id.toString();
    return result;
}

type TPage = {
    first: number;
    after: string;
    last: number;
    before: string;
}

export async function getFeeds({first, after, last, before}: TPage) {
    return await getList("feed", {first, after, last, before})
}

export async function addFeed({link, title}: { link: string, title: string }): Promise<any> {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const filter = {link};
        const update = {$set: {link, title}};
        const response = await database.db("xread").collection("feed").updateOne(filter, update, {upsert: true});
        const result = await database.db("xread").collection("feed").findOne(filter);
        if (result) {
            result.id = result._id.toString();
        }
        return result;
    } catch (e) {
        console.log(e.message);
        return null;
    } finally {
        if (database) {
            // @ts-ignore
            await database.close();
        }
    }
}

type TGetArticlesArgs = {
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
}

export async function getArticles(args: TGetArticlesArgs) {
    console.log(`getArticles:args=${JSON.stringify(args)}`);
    let {
        first, after, last, before, feedId, tag, topic, box, read = "all",
        priority = null,
        search: {keyword, score} = {keyword: null, score: null},
        seriesId
    } = args;
    assert(!!first || !!last, "first or last should grate then 0");
    assert(!(!!first && !!last), 'first or last cannot set same time');
    const database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
    const query: any = {};
    let sort;
    let limit;
    if (first) {
        sort = {_id: 1};
        limit = first;
        if (after) {
            query._id = {$gt: new ObjectId(after)};

        }
    } else {
        sort = {_id: -1};
        limit = last;
        if (before) {
            query._id = {$lt: new ObjectId(before)};
        }
    }
    if (feedId) {
        query.feedId = `${feedId}`
    }
    if (tag) {
        query.tags = tag;
    }
    if (topic) {
        query.topic = topic;
    }
    if (priority != null) {
        if (priority === 1) {
            query.priorities = {$elemMatch: {name: `${priority}`, score: {$gt: score ? score : 0.2}}}
        } else if (priority === -1) {
            query.priorities = {$elemMatch: {name: `${priority}`, score: {$gt: score ? score : 0.8}}}
        }
    }
    if (seriesId) {
        query.seriesId2 = seriesId;
    }
    switch (box) {
        case "inbox":
            query.spam = {$ne: true};
            break;
        case "spam":
            query.spam = true;
            break;
        default:
            break;
    }
    switch (read) {
        case "unread":
            query.read = {$ne: true};
            break;
        case "readed":
            query.read = true;
            break;
        default:
            break;
    }
    let filters = null;
    if (keyword) {
        filters = {
            $or: [
                {title: {$regex: `.*${keyword}.*`}},
                {summary: {$regex: `.*${keyword}.*`}},
            ]
        }
    }
    let query1 = query;
    if (filters) {
        query1 = {$and: [query, filters]}
    }
    console.debug(`getArticles:query=${JSON.stringify(query1)}`);
    const result = await database.db("xread").collection("article").find(query1).sort(sort).limit(limit).toArray();
    await database.close();
    result.forEach(it => it.id = it._id.toString());
    return result;
}

type TAddArticleArgs = {
    link: string;
    title: string;
    summary: string;
    time: string;
    feedId: string;
}
export type TSeries = {
    _id: string;
    title: string;
}


export async function addArticle({link, title, summary, time, feedId}: TAddArticleArgs): Promise<TArticle | null> {
    let database;


    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const filter = {title, link};
        let update: { $set: any } = {
            $set: {
                link,
                title,
                summary,
                time
            }
        };
        if (feedId) {
            update.$set.feedId = feedId;
        }
        const response = await database.db("xread").collection("article").updateOne(filter, update, {upsert: true});
        const result = await database.db("xread").collection("article").findOne(filter);
        if (result) {
            result.id = result._id.toString();
            // @ts-ignore
            result.extra = {updatedExisting: response.updatedExisting};
        }
        return result;
    } catch (e) {
        console.log(e.message);
        return null;
    } finally {
        if (database) {
            // @ts-ignore
            await database.close();
        }
    }
}

type TId = { id: string };

export async function readArticle({id}: TId): Promise<TArticle> {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        let filter = {_id: new ObjectId(id)};
        let update = {$set: {read: true}};
        const response = await database.db("xread").collection("article").updateOne(filter, update);
        const result = await database.db("xread").collection("article").findOne(filter);
        if (result) {
            result.id = result._id.toString();
        }
        return result;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function markArticleSpam({id}: TId) {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        let filter = {_id: new ObjectId(id)};
        let update = {$set: {spam: true}};
        const response = await database.db("xread").collection("article").updateOne(filter, update);
        const result = await database.db("xread").collection("article").findOne(filter);
        if (result) {
            result.id = result._id.toString();
        }
        return result;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function getTags(): Promise<Array<{ id: string, name: string }>> {
    const allTags = await getAllTags();
    return allTags.map(it => ({id: it, name: it}));
}

export async function getTopics(): Promise<Array<{ id: string, name: string }>> {
    const allTopics = await getAllTopics();
    return allTopics.map(it => ({id: it, name: it}));
}

export async function getAllTags(): Promise<Array<string>> {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const response = await database.db("xread").collection("article").distinct("tags", {});
        return response || [];
    } catch (e) {
        return [];
    } finally {
        if (database) {
            // @ts-ignore
            await database.close();
        }
    }
}

export async function getAllTopics(): Promise<Array<string>> {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const response = await database.db("xread").collection("article").distinct("topic", {});
        return response || [];
    } catch (e) {
        return [];
    } finally {
        if (database) {
            // @ts-ignore
            await database.close();
        }
    }
}
export type TArticle = {
    extra: any;
    id: string;
    feed: {
        title: string
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
}

export interface IDBArticle extends TArticle {
    _id: string
}
export async function getList(collectionName: string, {first, after, last, before}: TPage) {
    assert(!!first || !!last, "first or last should grate then 0");
    assert(!(!!first && !!last), 'first or last cannot set same time');
    const database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
    const query: any = {};
    let sort;
    let limit;
    if (first) {
        sort = {_id: 1};
        limit = first;
        if (after) {
            query._id = {$gt: new ObjectId(after)};

        }
    } else {
        sort = {_id: -1};
        limit = last;
        if (before) {
            query._id = {$lt: new ObjectId(before)};
        }
    }

    const result = await database.db("xread").collection(collectionName).find(query).sort(sort).limit(limit).toArray();
    await database.close();
    result.forEach(it => it.id = it._id.toString());
    return result;
}
