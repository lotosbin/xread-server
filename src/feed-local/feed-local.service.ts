import { Injectable } from '@nestjs/common';
import { FeedService, TAddArticleArgs, TArticle, TFeed, TGetArticlesArgs, TId, TPage } from '../feed/feed.service';
import { ConfigService } from '@nestjs/config';
import assert from 'assert';
import { MongoClient, ObjectId } from 'mongodb';

@Injectable()
export class FeedLocalService extends FeedService {
    private readonly mongoConnectionString: string;

    constructor(configService: ConfigService) {
        super();
        this.mongoConnectionString = configService.get<string>('MONGO');
        console.log(`FeedService:mongoConnectionString=${this.mongoConnectionString}`);
        assert(this.mongoConnectionString != null, `mongoConnectionString is null`);
    }

    async getFeed(id: string | null): Promise<TFeed | null> {
        if (!id) return null;
        const database = await MongoClient.connect(this.mongoConnectionString, {
            useNewUrlParser: true,
        });
        const result = await database
            .db('xread')
            .collection('feed')
            .findOne({ _id: new ObjectId(id) });
        await database.close();
        if (result) result.id = result._id.toString();
        return result;
    }

    async getFeeds({ first, after, last, before }: TPage): Promise<TFeed[]> {
        return await this.getList('feed', { first, after, last, before });
    }

    async addFeed({ link, title }: { link: string; title: string }): Promise<any> {
        let database;
        try {
            database = await MongoClient.connect(this.mongoConnectionString, {
                useNewUrlParser: true,
            });
            const filter = { link };
            const update = { $set: { link, title } };
            const response = await database
                .db('xread')
                .collection('feed')
                .updateOne(filter, update, { upsert: true });
            const result = await database
                .db('xread')
                .collection('feed')
                .findOne(filter);
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

    async getArticles(args: TGetArticlesArgs): Promise<TArticle[]> {
        console.log(`getArticles:args=${JSON.stringify(args)}`);
        let { first, after, last, before, feedId, tag, topic, box, read = 'all', priority = null, search: { keyword, score } = { keyword: null, score: null }, seriesId } = args;
        assert(!!first || !!last, 'first or last should grate then 0');
        assert(!(!!first && !!last), 'first or last cannot set same time');
        console.log(`FeedService:getArticles:mongoConnectionString=${this.mongoConnectionString}`);
        const database = await MongoClient.connect(this.mongoConnectionString, {
            useNewUrlParser: true,
        });
        const query: any = {};
        let sort;
        let limit;
        if (first) {
            sort = { _id: 1 };
            limit = first;
            if (after) {
                query._id = { $gt: new ObjectId(after) };
            }
        } else {
            sort = { _id: -1 };
            limit = last;
            if (before) {
                query._id = { $lt: new ObjectId(before) };
            }
        }
        if (feedId) {
            query.feedId = `${feedId}`;
        }
        if (tag) {
            query.tags = tag;
        }
        if (topic) {
            query.topic = topic;
        }
        if (priority != null) {
            if (priority === 1) {
                query.priorities = {
                    $elemMatch: {
                        name: `${priority}`,
                        score: { $gt: score ? score : 0.2 },
                    },
                };
            } else if (priority === -1) {
                query.priorities = {
                    $elemMatch: {
                        name: `${priority}`,
                        score: { $gt: score ? score : 0.8 },
                    },
                };
            }
        }
        if (seriesId) {
            query.seriesId2 = seriesId;
        }
        switch (box) {
            case 'inbox':
                query.spam = { $ne: true };
                break;
            case 'spam':
                query.spam = true;
                break;
            default:
                break;
        }
        switch (read) {
            case 'unread':
                query.read = { $ne: true };
                break;
            case 'readed':
                query.read = true;
                break;
            default:
                break;
        }
        let filters = null;
        if (keyword) {
            filters = {
                $or: [{ title: { $regex: `.*${keyword}.*` } }, { summary: { $regex: `.*${keyword}.*` } }],
            };
        }
        let query1 = query;
        if (filters) {
            query1 = { $and: [query, filters] };
        }
        console.debug(`getArticles:query=${JSON.stringify(query1)}`);
        const result = await database
            .db('xread')
            .collection('article')
            .find(query1)
            .sort(sort)
            .limit(limit)
            .toArray();
        await database.close();
        result.forEach(it => (it.id = it._id.toString()));
        return result;
    }

    async addArticle({ link, title, summary, time, feedId }: TAddArticleArgs): Promise<TArticle | null> {
        let database;
        try {
            database = await MongoClient.connect(this.mongoConnectionString, {
                useNewUrlParser: true,
            });
            const filter = { title, link };
            let update: { $set: any } = {
                $set: {
                    link,
                    title,
                    summary,
                    time,
                },
            };
            if (feedId) {
                update.$set.feedId = feedId;
            }
            const response = await database
                .db('xread')
                .collection('article')
                .updateOne(filter, update, { upsert: true });
            const result = await database
                .db('xread')
                .collection('article')
                .findOne(filter);
            if (result) {
                result.id = result._id.toString();
                // @ts-ignore
                result.extra = { updatedExisting: response.updatedExisting };
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

    async readArticle({ id }: TId): Promise<TArticle> {
        let database;
        try {
            database = await MongoClient.connect(this.mongoConnectionString, {
                useNewUrlParser: true,
            });
            let filter = { _id: new ObjectId(id) };
            let update = { $set: { read: true } };
            const response = await database
                .db('xread')
                .collection('article')
                .updateOne(filter, update);
            const result = await database
                .db('xread')
                .collection('article')
                .findOne(filter);
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

    async markArticleSpam({ id }: TId) {
        let database;
        try {
            database = await MongoClient.connect(this.mongoConnectionString, {
                useNewUrlParser: true,
            });
            let filter = { _id: new ObjectId(id) };
            let update = { $set: { spam: true } };
            const response = await database
                .db('xread')
                .collection('article')
                .updateOne(filter, update);
            const result = await database
                .db('xread')
                .collection('article')
                .findOne(filter);
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

    async getTags(): Promise<Array<{ id: string; name: string }>> {
        const allTags = await this.getAllTags();
        return allTags.map(it => ({ id: it, name: it }));
    }

    async getTopics(): Promise<Array<{ id: string; name: string }>> {
        const allTopics = await this.getAllTopics();
        return allTopics.map(it => ({ id: it, name: it }));
    }

    async getAllTags(): Promise<Array<string>> {
        let database;
        try {
            database = await MongoClient.connect(this.mongoConnectionString, {
                useNewUrlParser: true,
            });
            const response = await database
                .db('xread')
                .collection('article')
                .distinct('tags', {});
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

    async getAllTopics(): Promise<Array<string>> {
        let database;
        try {
            database = await MongoClient.connect(this.mongoConnectionString, {
                useNewUrlParser: true,
            });
            const response = await database
                .db('xread')
                .collection('article')
                .distinct('topic', {});
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

    async getList(collectionName: string, { first, after, last, before }: TPage) {
        assert(!!first || !!last, 'first or last should grate then 0');
        assert(!(!!first && !!last), 'first or last cannot set same time');
        const database = await MongoClient.connect(this.mongoConnectionString, {
            useNewUrlParser: true,
        });
        const query: any = {};
        let sort;
        let limit;
        if (first) {
            sort = { _id: 1 };
            limit = first;
            if (after) {
                query._id = { $gt: new ObjectId(after) };
            }
        } else {
            sort = { _id: -1 };
            limit = last;
            if (before) {
                query._id = { $lt: new ObjectId(before) };
            }
        }

        const result = await database
            .db('xread')
            .collection(collectionName)
            .find(query)
            .sort(sort)
            .limit(limit)
            .toArray();
        await database.close();
        result.forEach(it => (it.id = it._id.toString()));
        return result;
    }
}
