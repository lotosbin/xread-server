import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RecommendEntity } from './entities/recommend.entity';
import { RecommendStorageService } from '../recommend-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { feeds_group, feeds_result, group, groups_result } from '../../fever-api/fever-api';
import { GroupEntity } from './entities/group.entity';

@Injectable()
export class RecommendStorageSqliteService extends RecommendStorageService {
    private readonly logger = new Logger(RecommendStorageSqliteService.name);

    constructor(
        @InjectRepository(RecommendEntity)
        private recommendRepository: Repository<RecommendEntity>,
        @InjectRepository(GroupEntity)
        private groupRepository: Repository<GroupEntity>,
    ) {
        super();
    }

    async findAll(): Promise<RecommendEntity[]> {
        this.logger.log(`findAll`);
        let recommendEntities = await this.recommendRepository.find();
        this.logger.log(`findAll:result count=${recommendEntities.length}`);
        this.logger.debug(`findAll:${JSON.stringify(recommendEntities)}`);
        return recommendEntities;
    }

    async findByFeedAndBefore(feed_id: number, before: number): Promise<RecommendEntity[]> {
        this.logger.log(`findByFeedAndBefore`);
        return await this.recommendRepository
            .createQueryBuilder()
            .where(`feed_id=${feed_id}`)
            .andWhere(`created_on_time < ${before}`)
            .getMany();
    }

    async create(recommendEntity: RecommendEntity): Promise<RecommendEntity> {
        this.logger.log(`create`);
        const entities = await this.recommendRepository.find({
            feed_id: recommendEntity.feed_id,
        });
        if (entities.length == 0) {
            return await this.recommendRepository.save(recommendEntity);
        }
    }

    async remove(id: number) {
        this.logger.log(`remove:${id}`);
        await this.recommendRepository.delete(id);
    }

    async updateGroups(groups_result: groups_result): Promise<void> {
        const groups = groups_result.groups;
        const feed_groups = groups_result.feeds_groups;
        // super.updateGroups(groups);
        for (let i = 0; i < groups.length; i++) {
            let group: group = groups[i];
            let findOne = await this.groupRepository.findOne(group.id);
            if (findOne) {
                findOne.title = group.title;
                this.groupRepository.save(findOne);
            } else {
                let feedIds = feed_groups.find(e => e.group_id == group.id)?.feed_ids || '';
                const groupEntity = new GroupEntity(group.id, group.title, feedIds);
                this.groupRepository.insert(groupEntity);
            }
        }
    }

    async updateFeeds(feedsResult: feeds_result): Promise<void> {
        // super.updateFeeds(feedsResult);
    }
}
