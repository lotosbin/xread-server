import { Module } from '@nestjs/common';
import { FeedFeverService } from './feed-fever.service';

@Module({
    providers: [FeedFeverService],
})
export class FeedFeverModule {}
