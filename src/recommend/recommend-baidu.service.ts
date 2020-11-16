import { Injectable, Logger } from '@nestjs/common';
import { RecommendService } from './recommend.service';
import { Client, TDataSetListItem, TResults } from 'baidu-aip-easedl';
import moment from 'moment';
import { FeverApi } from '../fever-api/fever-api';

type TCache = { access_token: null | string; dataset: null | TDataSetListItem };

@Injectable()
export class RecommendBaiduService extends RecommendService {
    cache: TCache = { access_token: null, dataset: null };
    private readonly logger = new Logger(RecommendBaiduService.name);

    constructor(private api: FeverApi, private client: Client) {
        super();
    }

    async learn(id: string, text: string, label: string): Promise<void> {
        // super.learn(text, label);
        let textTrimmed = this.trim(text);
        this.logger.log(`learn:${textTrimmed}`);
        const datasetId = (await this.dataset_today()).dataset_id;
        await this.client.dataset_add_entity('TEXT_CLASSIFICATION', datasetId, name, textTrimmed, label);
    }

    private async dataset_today(): Promise<TDataSetListItem> {
        const date = moment(Date.now()).format('YYYYMMDD');
        if (this.cache.dataset != null && this.cache.dataset.dataset_name == date) {
            return this.cache.dataset;
        }
        const list = ((await this.client.dataset_list('TEXT_CLASSIFICATION')) || { results: [] }).results;
        let dataset2 = list.find(it => it.dataset_name === date);
        if (dataset2 != null) {
            this.cache.dataset = dataset2;
            return dataset2;
        }
        let dataset3 = await this.client.dataset_create('TEXT_CLASSIFICATION', date);
        this.cache.dataset = dataset3;
        return dataset3;
    }

    async recommend(text: string): Promise<boolean> {
        let textTrimmed = this.trim(text);
        this.logger.log(`recommend:${textTrimmed}`);
        let results = await this.client.text_cls_top(textTrimmed);
        this.logger.log(`recommend:results=${JSON.stringify(results)}`);
        if (results.error_code) {
            this.logger.error(`${results.error_msg}`);
            throw new Error(`${results.error_msg}`);
        }
        return results.results.find(e => e.name == '1' && e.score > 0.1) != null;
    }

    private trim(text: string) {
        let s = trim(text);
        if (s.length > 4096) {
            this.logger.warn(`trim: text is large then 4096`);
        }
        return s.slice(0, 4096);
    }
}

function trim(str: string) {
    return (str || '')
        .replace(/<[^>]+>/g, '')
        .replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, '')
        .replace(' ', '');
}
