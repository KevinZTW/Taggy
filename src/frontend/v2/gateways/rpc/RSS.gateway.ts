import { ChannelCredentials } from '@grpc/grpc-js';
import { CreateRSSSourceReply, ListRSSSourceFeedsReply, ListRSSSourcesReply, RSSServiceClient } from '../../protos/taggy';

const { RSS_SERVICE_ADDR = 'localhost:7070' } = process.env;

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
  listRSSSourceFeeds(sourceId: string){

    console.log("sourceId: " + sourceId)

    return new Promise<ListRSSSourceFeedsReply>((resolve, reject) =>
      client.listRssSourceFeeds({sourceId: sourceId}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  }
});

export default RSSGateway();
