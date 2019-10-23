import {addArticle, addFeed, markArticleSpam, readArticle} from "../service";
import {ARTICLE_ADDED, FEED_ADDED, pubsub} from "./common";
import {addFeedToStore} from "../store/service";

export const mutations = {
    addArticle: async (root: any, args: any, context: any) => {
        let article = await addArticle(args);
        if (!article) return null;
        if (!article.extra.updatedExisting) {
            pubsub.publish(ARTICLE_ADDED, {articleAdded: article});
        }
        return article;
    },
    addFeed: async (root: any, args: any, context: any) => {
        let feed = await addFeed(args);
        pubsub.publish(FEED_ADDED, {feedAdded: feed});
        if (feed) {
            addFeedToStore(feed)
        }
        return feed;
    },
    markReaded: async (root: any, args: any, context: any) => {
        return await readArticle(args);
    },
    markReadedBatch: async (root: any, {ids = []}, context: any) => {
        return Promise.all(ids.map(async id => {
            return await readArticle({id});
        }))
    },
    markSpam: async (root: any, args: any, context: any) => {
        return await markArticleSpam(args);
    },
    markSpamBatch: async (root: any, {ids = []}, context: any) => {
        return Promise.all(ids.map(async id => {
            return await markArticleSpam({id});
        }))
    },
};
