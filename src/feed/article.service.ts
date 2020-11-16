import { Injectable } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import * as R from 'ramda';
import { ConfigService } from '@nestjs/config';
import { IDBArticle, TArticle } from './feed.service';

@Injectable()
export class ArticleService {
    private readonly mongoConnectionString: string;

    constructor(configService: ConfigService) {
        this.mongoConnectionString = configService.get<string>('MONGO');
    }

    async nextParseSeriesArticle({ before }: { before: string }): Promise<IDBArticle> {
        console.log(`nextParseSeriesArticle:before=${before}`);
        let database;
        try {
            database = await MongoClient.connect(this.mongoConnectionString, {
                useNewUrlParser: true,
            });
            const filter: any = {
                title: { $regex: /([\（\(][一二三四五六七八九十]+[\）\)])/m },
                seriesId2: { $exists: false },
            };
            if (before) {
                filter._id = { $lt: new ObjectId(before) };
            }
            const articles = await database
                .db('xread')
                .collection('article')
                .find(filter)
                .sort({ _id: -1 })
                .limit(1)
                .toArray();
            const result: any = R.head(articles);
            console.debug(`nextParseSeriesArticle:${JSON.stringify(result)}`);
            return result;
        } finally {
            if (database) {
                await database.close();
            }
        }
    }

    async addArticleSeries(id: string, seriesId: string) {
        console.log(`addArticleSeries:id=${id},seriesId=${seriesId}`);
        let database;
        try {
            database = await MongoClient.connect(this.mongoConnectionString, {
                useNewUrlParser: true,
            });
            let update = { $set: { seriesId2: seriesId } };
            const response = await database
                .db('xread')
                .collection('article')
                .updateOne({ _id: new ObjectId(id) }, update);
        } finally {
            if (database) {
                await database.close();
            }
        }
    }

    async parseArticleSeries(article: TArticle): Promise<string> {
        return await this.parseSeries(article.title || '');
    }

    async parseSeries(title: string): Promise<string> {
        try {
            const regex = /([\s\S]*)([\（\(][一二三四五六七八九十]+[\）\)])([\s\S]*)/m;
            const match = title.match(regex);
            console.log(JSON.stringify(match));
            if (match && match.length === 4) {
                return match[1];
            }
            return '';
        } catch (e) {
            console.error(e);
            return '';
        }
    }
}
