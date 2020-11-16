import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FeedService } from './feed.service';

@Resolver('Node')
export class NodeResolver {
    constructor(private feedService: FeedService) {}

    @Query()
    async node(@Parent() parent: any, @Args() args: any) {
        let { id, type }: any = args;
        if (type) {
            switch (type) {
                case 'Feed':
                    const feed: any = await this.feedService.getFeed(id);
                    if (feed) {
                        feed.__type = 'Feed';
                        return feed;
                    }
                    break;
                case 'Tag':
                    return { id: id, name: id, __type: type };
                case 'Topic':
                    return { id: id, name: id, __type: type };
                case 'Series':
                    return { _id: id, title: id, __type: type };
            }
        }
        if (!(type && type !== 'Feed')) {
            const feed: any = await this.feedService.getFeed(id);
            if (feed) {
                feed.__type = 'Feed';
                return feed;
            }
        }
        if (id) return { id: id, name: id, __type: type || 'Tag' };
        else return null;
    }

    @ResolveField()
    __resolveType(@Parent() obj: any) {
        if (obj.__type) return obj.__type;
        if (obj.name) {
            return 'Tag';
        } else if (obj.title) {
            if (obj.summary) {
                return 'Article';
            } else {
                return 'Feed';
            }
        }
        return null;
    }

    @ResolveField()
    __typename(@Parent() obj: any) {
        if (obj.__type) return obj.__type;
        if (obj.name) {
            return 'Tag';
        } else if (obj.title) {
            if (obj.summary) {
                return 'Article';
            } else {
                return 'Feed';
            }
        }
        return null;
    }
}
