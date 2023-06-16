import {RSSSource, RSSFeed} from '../protos/taggy';
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
    listRSSSourceFeeds(sourceId: string){
        return request<RSSFeed[]>({
            url: `${basePath}/rss/feeds`,
            queryParams: {sourceId: sourceId},
        })
    }
});

export default ApiGateway();