import { ChannelCredentials } from '@grpc/grpc-js';
import { GetRSSFeedReply, CreateRSSFeedReply, ListRSSFeedItemsReply, ListRSSFeedsReply, RSSServiceClient, GetRSSItemReply } from '../../protos/taggy';

const { RSS_SERVICE_ADDR = 'localhost:7070' } = process.env;
const { RECOMMENDATION_SERVICE_ADDR = 'localhost:7071' } = process.env;

const client = new RSSServiceClient(RSS_SERVICE_ADDR, ChannelCredentials.createInsecure());

const RSSGateway = () => ({
  listRSSFeeds() {
    return new Promise<ListRSSFeedsReply>((resolve, reject) =>
      client.listRssFeeds({}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  addRSSFeed(url : string) {
    return new Promise<CreateRSSFeedReply>((resolve, reject) =>
      client.createRssFeed({url: url}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  getRSSFeed(feedId : string) {
    return new Promise<GetRSSFeedReply>((resolve, reject) =>
      client.getRssFeed({feedId: feedId}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  getRSSItem(itemId : string) {
    return new Promise<GetRSSItemReply>((resolve, reject) =>
      client.getRssItem({itemId: itemId}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  listRSSItems(page : number, limit: number) {
    return new Promise<ListRSSFeedItemsReply>((resolve, reject) =>
      client.listRssItems({page: page, limit: limit}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  listRSSFeedItems(feedId: string){
    return new Promise<ListRSSFeedItemsReply>((resolve, reject) =>
      client.listRssFeedItems({feedId: feedId}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  }
});

export default RSSGateway();
