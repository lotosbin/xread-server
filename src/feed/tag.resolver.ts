import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { makeConnection } from '../relay';
import { FeedService } from './feed.service';

@Resolver('Tag')
export class TagResolver {
    constructor(private feedService: FeedService) {}

    @Query()
    async tags(@Parent() parent: any, @Args() args: any) {
        return await makeConnection(args => this.feedService.getTags())(args);
    }

    @ResolveField()
    async articles(parent: any, @Args() args: any, context: any) {
        console.log(`Tag,parent=${JSON.stringify(parent)}`);
        return await makeConnection(args => this.feedService.getArticles(args))({ ...args, tag: parent.id });
    }
}
