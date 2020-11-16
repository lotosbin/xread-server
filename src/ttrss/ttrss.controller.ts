import { Controller, Get } from '@nestjs/common';
import { TtrssService } from './ttrss.service';

@Controller('ttrss')
export class TtrssController {
    constructor(
        private ttrssService: TtrssService,
    ) {
    }

    @Get()
    async get() {
        this.ttrssService.parse();
    }
}
