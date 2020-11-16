import { Injectable, Logger } from '@nestjs/common';
import { ApiFactory } from 'ttrss-js-api';
import { Cron } from '@nestjs/schedule';


@Injectable()
export class TtrssService {
    api = ApiFactory.build('http://192.168.31.58:181/api/');
    logger = new Logger(TtrssService.name);

    constructor() {
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
