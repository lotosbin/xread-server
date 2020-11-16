import { Injectable } from '@nestjs/common';
import { RecommendEntity } from './sqlite/entities/recommend.entity';
import { feeds_result, groups_result } from '../fever-api/fever-api';

@Injectable()
export abstract class RecommendStorageService {
    abstract findAll(): Promise<RecommendEntity[]>;

    abstract create(recommendEntity: RecommendEntity): Promise<RecommendEntity>;

    abstract findByFeedAndBefore(feed_id: number, before: number): Promise<RecommendEntity[]>;

    abstract async remove(id: number);

    async updateGroups(groups_result: groups_result) {
        throw new Error('not implement');
    }

    async updateFeeds(feedsResult: feeds_result) {
        throw new Error('not implement');
    }
}
