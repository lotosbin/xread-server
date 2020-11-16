import { Injectable } from '@nestjs/common';
import { Article } from '../graphql';

@Injectable()
export class FeedRecommendService {
    constructor() {
    }

    async getArticles(args: any): Promise<Article[]> {
        //todo
        return [];
    }
}
