import {RSSSource, RSSItem} from '../protos/taggy';
import request from '../utils/Request';


const basePath = '/api';


const ApiGateway = () => ({
    listRSSSources(){
        return request<RSSSource[]>({
            url: `${basePath}/rss/feeds`,
        })
    },
    addRSSSource(url: string){
        return request<RSSSource>({
            url: `${basePath}/rss/feeds`,
            method: 'POST',
            body: {url: url },
        })
    },
    getRSSSource(sourceId: string){
        return request<RSSSource>({
            url: `${basePath}/rss/feeds`,
            queryParams: {sourceId: sourceId},
        })
    },
    getRSSItem(itemId: string){
        return request<RSSItem>({
            url: `${basePath}/rss/items/${itemId}`,
        })
    },
    listRSSSourceItems(sourceId: string){
        return request<RSSItem[]>({
            url: `${basePath}/rss/items`,
            queryParams: {sourceId: sourceId},
        })
    }
});

export default ApiGateway();