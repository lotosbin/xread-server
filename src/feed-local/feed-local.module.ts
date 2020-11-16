import { Module } from '@nestjs/common';
import { FeedLocalService } from './feed-local.service';

@Module({
    providers: [FeedLocalService],
})
export class FeedLocalModule {}
