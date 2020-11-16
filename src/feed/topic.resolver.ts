import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { makeConnection } from '../relay';
import { FeedService } from './feed.service';

@Resolver('Topic')
export class TopicResolver {
    constructor(private feedService: FeedService) {}

    @Query()
    async topics(@Parent() parent: any, @Args() args: any) {
        return await makeConnection(args => this.feedService.getTopics())(args);
    }

    @ResolveField()
    async articles(@Parent() parent: any, @Args() args: any) {
        console.log(`Topic,parent=${JSON.stringify(parent)}`);
        return await makeConnection(args => this.feedService.getArticles(args))({ ...args, topic: parent.id });
    }
}
