import { ChannelCredentials } from '@grpc/grpc-js';
import { GetRSSItemTagsRequest, GetRSSItemTagsReply, RecommendationServiceClient } from '../../protos/taggy';

// TODO: Add to .env
const { RECOMMENDATION_SERVICE_ADDR = 'localhost:7071' } = process.env;

const client = new RecommendationServiceClient(RECOMMENDATION_SERVICE_ADDR, ChannelCredentials.createInsecure());

const TaggingGateway = () => ({
  listItemTags(itemId : string ) {
    return new Promise<GetRSSItemTagsReply>((resolve, reject) =>
      client.getRssItemTags({itemId: itemId}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
});

export default TaggingGateway();
