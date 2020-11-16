import { Body, Controller, Get, Logger, Param, Post, Query, Req } from '@nestjs/common';
import { FeverApi } from '../fever-api/fever-api';

import { RecommendStorageService } from '../recommend-storage/recommend-storage.service';
import { RecommendService } from '../recommend/recommend.service';
import { HtmlEncoder } from '../utils/utils';

@Controller('fever/recommend')
export class FeverRecommendController {
    private readonly logger = new Logger(FeverRecommendController.name);

    constructor(
        private api: FeverApi,
        private recommendService: RecommendService,
        private recommendStorageService: RecommendStorageService) {
    }

    @Get()
    async get(@Param() params: any, @Query() query: any, @Body() body: any): Promise<any> {
        this.logger.log(`fever recommend api post ,params:${JSON.stringify(params)},query=${JSON.stringify(query)},body=${JSON.stringify(body)}`);

        if (query.hasOwnProperty('refresh')) {
            return '';
        }
        return '';
    }

    @Post()
    async post(@Req() request: any, @Param() params: any, @Query() query: any, @Body() body: any): Promise<any> {
        this.logger.log(`fever recommend api post ,params:${JSON.stringify(params)},query=${JSON.stringify(query)},body=${JSON.stringify(body)}`);
        if (query.hasOwnProperty('groups')) {
            // let groupsResult = await this.api.groups();
            // groupsResult.groups = [];
            // groupsResult.feeds_groups = [];
            // this.logger.log(`groups result:${JSON.stringify(groupsResult)}`);
            // return groupsResult;
            return await this.api.post(query, body);

            // } else if (query.hasOwnProperty('feeds')) {
            //     let feedsResult = await this.api.feeds();
            //     feedsResult.feeds = [{
            //         id: Number.MAX_SAFE_INTEGER,
            //         favicon_id: 1,
            //         title: 'recommend',
            //         url: '',
            //         site_url: '',
            //         last_updated_on_time: 1586254776,
            //         is_spark: false,
            //     }]
            //     feedsResult.feeds_groups = [];
            //     this.logger.log(`feeds result:${JSON.stringify(feedsResult)}`)
            //     return feedsResult
            // } else if (query.hasOwnProperty('favicons')) {
            //     return await this.api.favicons()
        } else if (query.hasOwnProperty('unread_item_ids')) {
            this.logger.log(`unread_item_ids`);
            let unreadItemIdsResultPromise = this.api.unread_item_ids();
            let findAllPromise = this.recommendStorageService.findAll();
            const recommendEntities = await findAllPromise;
            const unreadItemIdsResult = await unreadItemIdsResultPromise;
            const ids = unreadItemIdsResult.unread_item_ids.split(',');
            let result = {
                unread_item_ids: recommendEntities
                    .map(it => it.id)
                    .filter(it => ids.indexOf(String(it)) >= 0)
                    .join(','),
            };
            this.logger.debug(`unread_item_ids result:${JSON.stringify(result)}`);
            return result;
        } else if (query.hasOwnProperty('items')) {
            this.logger.log(`items`);
            let itemsResultPromise = this.api.items(query);
            let findAll = this.recommendStorageService.findAll();
            let itemsResult = await itemsResultPromise;
            const recommendEntities = await findAll;
            const recommend_ids: number[] = recommendEntities.map(it => it.id);
            itemsResult.items = itemsResult.items.filter(it => recommend_ids.indexOf(it.id) >= 0);
            this.logger.log(`items result count=${itemsResult.items.length},total_items=${itemsResult.total_items}`);
            this.logger.debug(`items result:${JSON.stringify(itemsResult)}`);
            return itemsResult;
            // } else {
            //     //auth
            //     return await this.api.auth()
        }
        // if (query.hasOwnProperty('links')) {
        //     let linksResult = await this.api.links();
        //     console.log(`links results:${JSON.stringify(linksResult)}`)
        //     return linksResult
        // }
        if (body.mark == 'feed' && body.as == 'read' && body.before) {
            this.logger.log(`mark all feed item as read`);
            const items = await this.recommendStorageService.findByFeedAndBefore(body.id, body.before);
            // noinspection ES6MissingAwait
            items.forEach(async item => {
                // noinspection ES6MissingAwait
                this.recommendStorageService.remove(item.id);
                // noinspection ES6MissingAwait
                this.api.post({ api: '' }, { mark: 'item', as: 'read', id: item.id });
            });
        } else if (body.mark == 'item' && body.as == 'saved') {
            this.logger.log(`mark item as saved`);
            // noinspection ES6MissingAwait
            const id = body.id;
            const result = await this.api.items({ with_ids: `${id}` });
            if (!result.items.length) {
                this.logger.warn(`item ${id} not found`);
            } else {
                const item = result.items[0];
                await this.recommendService.learn(String(id), `${item.title}${item.author}${HtmlEncoder.decode(item.html)}`, '1');
            }
        }
        let result = await this.api.post(query, body);
        this.logger.debug(`items result:${JSON.stringify(result)}`);
        return result;
    }
}
