import { ChannelCredentials } from '@grpc/grpc-js';
import { GetRSSSourceReply, CreateRSSSourceReply, ListRSSSourceFeedsReply, ListRSSSourcesReply, RSSServiceClient, GetRSSFeedReply } from '../../protos/taggy';

const { RSS_SERVICE_ADDR = 'localhost:7070' } = process.env;
const { TAGGING_SERVICE_ADDR = 'localhost:7071' } = process.env;

const client = new RSSServiceClient(RSS_SERVICE_ADDR, ChannelCredentials.createInsecure());

const RSSGateway = () => ({
  listRSSSources() {
    return new Promise<ListRSSSourcesReply>((resolve, reject) =>
      client.listRssSources({}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  addRSSSource(url : string) {
    return new Promise<CreateRSSSourceReply>((resolve, reject) =>
      client.createRssSource({url: url}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  getRSSSource(sourceId : string) {
    return new Promise<GetRSSSourceReply>((resolve, reject) =>
      client.getRssSource({sourceId: sourceId}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  getRSSFeed(feedId : string) {
    return new Promise<GetRSSFeedReply>((resolve, reject) =>
      client.getRssFeed({feedId: feedId}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  listRSSSourceFeeds(sourceId: string){
    return new Promise<ListRSSSourceFeedsReply>((resolve, reject) =>
      client.listRssSourceFeeds({sourceId: sourceId}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  }
});

export default RSSGateway();
