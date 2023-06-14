import { ChannelCredentials } from '@grpc/grpc-js';
import { CreateRSSSourceReply, ListRSSSourcesReply, RSSServiceClient } from '../../protos/taggy';

const { RSS_SERVICE_ADDR = 'localhost:7070' } = process.env;

const client = new RSSServiceClient(RSS_SERVICE_ADDR, ChannelCredentials.createInsecure());

const RSSGateway = () => ({
  listRssSources() {
    return new Promise<ListRSSSourcesReply>((resolve, reject) =>
      client.listRssSources({}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  addRssSource(url : string) {
    return new Promise<CreateRSSSourceReply>((resolve, reject) =>
      client.createRssSource({url: url}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
});

export default RSSGateway();
