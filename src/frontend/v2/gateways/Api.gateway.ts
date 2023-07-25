import {RSSFeed, RSSItem} from '../protos/taggy';
import request from '../utils/Request';


const basePath = '/api';


const ApiGateway = () => ({
    listRSSFeeds(){
        return request<RSSFeed[]>({
            url: `${basePath}/rss/feeds`,
        })
    },
    addRSSFeed(url: string){
        return request<RSSFeed>({
            url: `${basePath}/rss/feeds`,
            method: 'POST',
            body: {url: url },
        })
    },
    getRSSFeed(feedId: string){
        return request<RSSFeed>({
            url: `${basePath}/rss/feeds`,
            queryParams: {feedId: feedId},
        })
    },
    getRSSItem(itemId: string){
        return request<RSSItem>({
            url: `${basePath}/rss/items/${itemId}`,
        })
    },
    listRSSItems(page: number, limit: number){
        return request<RSSItem[]>({
            url: `${basePath}/rss/items`,
            queryParams: {page: page, limit: limit},
        })
    },
    listRSSFeedItems(feedId: string){
        return request<RSSItem[]>({
            url: `${basePath}/rss/items`,
            queryParams: {feedId: feedId},
        })
    }
});

export default ApiGateway();