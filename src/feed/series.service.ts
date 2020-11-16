import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

@Injectable()
export class SeriesService {
    private readonly mongoConnectionString: string;

    constructor(configService: ConfigService) {
        this.mongoConnectionString = configService.get<string>('MONGO');
    }

    async getSeries(): Promise<Array<{ _id: string; title: string }>> {
        var allTags = await this.getAllSeries();
        return allTags.filter(it => !!it).map(it => ({ _id: it, title: it }));
    }

    async getAllSeries(): Promise<Array<string>> {
        let database: MongoClient | null = null;
        try {
            database = await MongoClient.connect(this.mongoConnectionString, {
                useNewUrlParser: true,
            });
            const response = await database
                .db('xread')
                .collection('article')
                .distinct('seriesId2', {});
            return response || [];
        } catch (e) {
            return [];
        } finally {
            if (database != null) {
                // @ts-ignore
                await database.close();
            }
        }
    }
}
