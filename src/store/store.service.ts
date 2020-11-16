import { Injectable } from '@nestjs/common';
import { ApolloFetch, createApolloFetch } from 'apollo-fetch';
import { ConfigService } from '@nestjs/config';

export type TAddFeedToStoreParam = {
    link: string;
    title: string;
};

@Injectable()
export class StoreService {
    private readonly fetch: ApolloFetch;

    constructor(configService: ConfigService) {
        this.fetch = createApolloFetch({
            uri: configService.get<string>('STORE_API_URL'),
        });
    }

    async addFeedToStore({ link, title }: TAddFeedToStoreParam) {
        try {
            const res = await this.fetch({
                query: `mutation addFeed($link:String!,$title:String){
  addFeed(link:$link,title:$title){
    id
    link
    title
  }
}`,
                variables: { link: link, title: title },
            });
            console.info(`addFeedToStore:result:${JSON.stringify(res)}`);
        } catch (e) {
            console.error('addFeedToStore', e);
        }
    }
}
