import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FeverApi, item } from '../fever-api/fever-api';
import { RecommendService } from './recommend.service';
import { RecommendStorageService } from '../recommend-storage/recommend-storage.service';
import { RecommendEntity } from '../recommend-storage/sqlite/entities/recommend.entity';

const qps = 4;
const timeout = 1000 / (qps - 1);

@Injectable()
export class RecommendTaskService {
    private readonly logger = new Logger(RecommendTaskService.name);

    constructor(private api: FeverApi, private recommendService: RecommendService, private storageService: RecommendStorageService) {
    }

    // @Cron('0 */15 * * * *', {
    //     name: 'recommend-parse',
    // })
    async parse() {
        try {
            this.logger.debug('Called per 15 min');
            //sync groups
            const groupsResult = await this.api.groups();
            await this.storageService.updateGroups(groupsResult);
            //sync feeds
            const feedsResult = await this.api.feeds();
            await this.storageService.updateFeeds(feedsResult);
            let unreadItemIdsResult = await this.api.unread_item_ids();
            this.logger.log(`unread_item_ids:${unreadItemIdsResult.unread_item_ids}`);
            let itemsResult1 = (await this.api.items({
                with_ids: unreadItemIdsResult.unread_item_ids,
            })) || { items: [] };
            let that = this;
            let generate = async function* () {
                for (let item of itemsResult1.items) {
                    await sleep(timeout);
                    yield await that.parseItem(item);
                }
            };

            for await (let item of generate()) {
                await item;
            }
        } catch (e) {
            this.logger.error(`parse error:${e.name}:${e.message}`, e.stack);
        }
    }

    private async parseItem(item1: item) {
        try {
            this.logger.log(`parseItem:${item1.id}`);
            const it = await this.recommendService.recommend(`${item1.title}${item1.html || ''}`);
            this.logger.log(`priority:${JSON.stringify(it)}`);
            if (it) {
                await this.storageService.create(new RecommendEntity(item1.id, item1.feed_id, item1.created_on_time));
            }
        } catch (e) {
            this.logger.error(`parseItem error:${e.message}`, e.stack);
        }
    }
}

const sleep = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));
