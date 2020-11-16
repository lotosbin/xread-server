import { PubSub } from 'graphql-subscriptions';

export const ARTICLE_ADDED = 'ARTICLE_ADDED';
export const FEED_ADDED = 'FEED_ADDED';
export const pubsub = new PubSub();
