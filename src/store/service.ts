import {createApolloFetch} from "apollo-fetch";
import config from "../config";


const fetch = createApolloFetch({
    uri: config.store_api_url,
});

export type TAddFeedToStoreParam = {
    link: string,
    title: string
};

export async function addFeedToStore({link, title}: TAddFeedToStoreParam) {
    try {
        const res = await fetch({
            query: `mutation addFeed($link:String!,$title:String){
  addFeed(link:$link,title:$title){
    id
    link
    title
  }
}`,
            variables: {link: link, title: title},
        });
        console.info(`addFeedToStore:result:${JSON.stringify(res)}`)
    } catch (e) {
        console.error("addFeedToStore", e)
    }
}
