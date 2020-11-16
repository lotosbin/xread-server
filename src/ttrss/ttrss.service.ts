import { Injectable, Logger } from '@nestjs/common';
import { ApiFactory, Api } from 'ttrss-js-api';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TtrssService {
    logger = new Logger(TtrssService.name);
    private api: Api;

    constructor(configService: ConfigService) {
        this.api = ApiFactory.build(configService.get<string>('TTRSS_API_ENDPOINT'));
    }

    async test() {
        return this.api.isLoggedIn();
    }

    @Cron('0 */5 * * * *', {
        name: 'recommend-parse',
    })
    async parse() {
        this.logger.log(`parse`);
        if (!await this.api.isLoggedIn()) {
            await this.api.login('admin', 'password');
        }
        if (await this.api.isLoggedIn()) {

        }
    }
}
