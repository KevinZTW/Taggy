import { ChannelCredentials } from '@grpc/grpc-js';
import { GetRSSItemTagsRequest, GetRSSItemTagsReply, TaggingServiceClient } from '../../protos/taggy';

// TODO: Add to .env
const { TAGGING_SERVICE_ADDR = 'localhost:7071' } = process.env;

const client = new TaggingServiceClient(TAGGING_SERVICE_ADDR, ChannelCredentials.createInsecure());

const TaggingGateway = () => ({
  listFeedTags(feedId : string ) {
    return new Promise<GetRSSItemTagsReply>((resolve, reject) =>
      client.getRSSItemTags({id: feedId}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
});

export default TaggingGateway();
