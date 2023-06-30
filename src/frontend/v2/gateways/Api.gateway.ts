import {RSSSource, RSSItem} from '../protos/taggy';
import request from '../utils/Request';


const basePath = '/api';


const ApiGateway = () => ({
    listRSSSources(){
        return request<RSSSource[]>({
            url: `${basePath}/rss`,
        })
    },
    addRSSSource(url: string){
        return request<RSSSource>({
            url: `${basePath}/rss`,
            method: 'POST',
            body: {url: url },
        })
    },
    getRSSSource(sourceId: string){
        return request<RSSSource>({
            url: `${basePath}/rss`,
            queryParams: {sourceId: sourceId},
        })
    },
    getRSSItem(feedId: string){
        return request<RSSItem>({
            url: `${basePath}/rss/feeds/${feedId}`,
        })
    },
    listRSSSourceItems(sourceId: string){
        return request<RSSItem[]>({
            url: `${basePath}/rss/feeds`,
            queryParams: {sourceId: sourceId},
        })
    }
});

export default ApiGateway();