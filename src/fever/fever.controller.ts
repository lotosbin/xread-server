import { Body, Controller, Get, Logger, Param, Post, Query, Req } from '@nestjs/common';
import { FeverApi } from '../fever-api/fever-api';
import { RecommendService } from '../recommend/recommend.service';
import { HtmlEncoder } from '../utils/utils';

/*A feed object has the following members:

id (positive integer)
favicon_id (positive integer)
title (utf-8 string)
url (utf-8 string)
site_url (utf-8 string)
is_spark (boolean integer)
last_updated_on_time (Unix timestamp/integer)*/
interface Feed {
    id: number;
    favicon_id: number;
    title: string;
    url: string;
    site_url: string;
    is_spark: boolean;
    last_updated_on_time: number;
}

interface FeedsResult {
    feeds: Feed[];
    feeds_groups: [];
}

/*A feeds_group object has the following members:

group_id (positive integer)
feed_ids (string/comma-separated list of positive integers)*/
interface feeds_group {
    group_id: number;
    feed_ids: string;
}

/*
 * @see https://feedafever.com/api
 * */
@Controller('fever')
export class FeverController {
    private readonly logger = new Logger(FeverController.name);

    constructor(private api: FeverApi, private recommendService: RecommendService) {
    }

    @Get()
    async get(@Query() query: any): Promise<any> {
        if (query.hasOwnProperty('refresh')) {
            return '';
        }
        return '';
    }

    @Post()
    async post(@Req() request: any, @Param() params: any, @Query() query: any, @Body() body: any): Promise<any> {
        this.logger.log(`fever api,params:${JSON.stringify(params)},query=${JSON.stringify(query)}`);
        // if (query.hasOwnProperty('groups')) {
        //     let groupsResult = await this.api.groups();
        //     console.log(`groups result:${JSON.stringify(groupsResult)}`)
        //     return groupsResult;
        // } else if (query.hasOwnProperty('feeds')) {
        //     let feedsResult = await this.api.feeds();
        //     console.log(`feeds result:${JSON.stringify(feedsResult)}`)
        //     return feedsResult
        // } else if (query.hasOwnProperty('favicons')) {
        //     return await this.api.favicons()
        // } else if (query.hasOwnProperty('unread_item_ids')) {
        //     let unreadItemIdsResult = await this.api.unread_item_ids();
        //     return unreadItemIdsResult
        // } else if (query.hasOwnProperty('items')) {
        //     let itemsResult = await this.api.items(query);
        //     return itemsResult
        //     // } else {
        //     //     //auth
        //     //     return await this.api.auth()
        // }
        // if (query.hasOwnProperty('links')) {
        //     let linksResult = await this.api.links();
        //     console.log(`links results:${JSON.stringify(linksResult)}`)
        //     return linksResult
        // }
        if (body.mark == 'item' && body.as == 'saved') {
            const result = await this.api.items({ with_ids: `${(body.id)}` });
            if (!result.items.length) {
                this.logger.warn(`item ${(body.id)} not found`);
            } else {
                const item = result.items[0];
                await this.recommendService.learn(String(body.id), `${item.title}${item.author}${HtmlEncoder.decode(item.html)}`, '1');
            }
        }
        return await this.api.post(query, body);
    }
}


