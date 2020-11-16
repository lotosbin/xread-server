import { URL, URLSearchParams } from 'url';
import { auth_result, favicons_result, feeds_result, FeverApi, groups_result, items_args, items_result, links_result, saved_item_ids_result, unread_item_ids_result } from './fever-api';
import crypto from 'crypto';
import { HttpService, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';

export class TTRssFeverApi extends FeverApi {
    private readonly logger = new Logger(TTRssFeverApi.name);

    private readonly endpoint: string;
    private readonly username: string;
    private readonly password: string;
    private readonly api_key: string;

    constructor(
        configService: ConfigService,
        private httpService: HttpService,
    ) {
        super();
        this.endpoint = configService.get<string>('TTRSS_FEVER_ENDPOINT');
        this.username = configService.get<string>('TTRSS_FEVER_USERNAME');
        this.password = configService.get<string>('TTRSS_FEVER_PASSWORD');
        this.api_key = md5(`${this.username}:${this.password}`);
    }

    async auth(): Promise<auth_result> {
        return await this.post({ api: '' }, {});
    }

    async feeds(): Promise<feeds_result> {
        return await this.post({ api: '', feeds: '' }, {});
    }

    async groups(): Promise<groups_result> {
        return await this.post({ api: '', groups: '' }, {});
    }

    async favicons(): Promise<favicons_result> {
        return await this.post({ api: '', favicons: '' }, {});
    }

    async items(args: items_args): Promise<items_result> {
        this.logger.log(`items:${JSON.stringify(args)}`);
        const ids = (args.with_ids || '').split(',').filter(it => it != null && it != '');
        if (ids.length > 50) {
            const that = this;
            const generate = function* () {
                for (let sids of _.chunk(ids, 50)) {
                    yield that._item({ ...args, with_ids: sids.join(',') });
                }
            };
            const results: items_result = { items: [], total_items: 0 };
            for await (let g of generate()) {
                const result = await g;
                results.items = results.items.concat(result.items);
                results.total_items = result.total_items;
            }
            this.logger.debug(`items result:${JSON.stringify(results)}`);
            return results;
        }
        let itemsResult = await this._item(args);
        this.logger.debug(`items result:${JSON.stringify(itemsResult)}`);
        return itemsResult;
    }

    private async _item(args: items_args): Promise<items_result> {
        try {
            let url = `${this.endpoint}?api&items&api_key=${this.api_key}`;
            if (args.max_id != null) url += `&max_id=${args.max_id}`;
            if (args.since_id != null) url += `&since_id=${args.since_id}`;
            if (args.with_ids != null) url += `&with_ids=${args.with_ids}`;
            let response = await this.httpService.get(url).toPromise();
            if (response.status == 200) {
                return await response.data;
            }
            throw new Error(`${response.status}:${response.statusText}:${response.data}`);
        } catch (e) {
            this.logger.error(`${e.message}`);
        }
    }

    async saved_item_ids(): Promise<saved_item_ids_result> {
        let response = await this.httpService.get(`${this.endpoint}?api&saved_item_ids&api_key=${this.api_key}`).toPromise();
        return await response.data;
    }

    async unread_item_ids(): Promise<unread_item_ids_result> {
        this.logger.log(`unread_item_ids`);
        let response = await this.httpService.get(`${this.endpoint}?api&unread_item_ids&api_key=${this.api_key}`).toPromise();
        let result = await response.data;
        this.logger.debug(`unread_item_ids result:${JSON.stringify(result)}`);
        return result;
    }

    async links(): Promise<links_result> {
        const { unread_item_ids } = await this.unread_item_ids();
        let { items } = await this.items({ with_ids: unread_item_ids });
        return {
            links: items
                .map((item, index) => ({
                    id: index,
                    feed_id: item.feed_id,
                    item_id: item.id,
                    temperature: 1,
                    is_item: true,
                    is_local: false,
                    is_saved: item.is_saved,
                    title: item.title,
                    url: item.url,
                    item_ids: `${item.id}`,
                }))
                .slice(0, 1),
        };
    }

    async post(args: any, body: any): Promise<any> {
        this.logger.log(`post:args=${JSON.stringify(args)},body=${JSON.stringify(body)}`);
        let s = new URL(`${this.endpoint}`);
        const params = new URLSearchParams(s.search);
        Object.keys(args).forEach((key, index) => params.append(key, args[key]));
        params.append('api_key', this.api_key);
        s.search = params.toString();
        const form = new FormData();
        Object.keys(body).forEach((key, index) => form.append(encodeURIComponent(key), encodeURIComponent(body[key])));
        let response: any = await this.httpService.post(s.toString(), form, {
            headers: form.getHeaders(),
        }).toPromise();
        if (response.status != 200) {
            this.logger.warn(`post result error: ${response.status},${response.statusText}`);
        }
        const result = response.data;
        this.logger.debug(`result:${JSON.stringify(result)}`);
        return result;
    }
}

function md5(str: string) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(str);
    return md5sum.digest('hex');
}
