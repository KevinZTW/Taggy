import type { NextApiRequest, NextApiResponse } from 'next';
import { GetRSSFeedTagsRequest, GetRSSFeedTagsReply } from '../../../protos/taggy';
import TaggingGateway from '../../../gateways/rpc/Tagging.gateway';


const handler = async ({ method, body, query }: NextApiRequest, res) => {
  switch (method) {
    case 'GET': {
      const feedId : string = query.feedId as string;
      if (feedId) {
        console.log("we got feedId!")
        const { tags = [] } = await TaggingGateway.listFeedTags(feedId);
        return res.status(200).json(tags);
      }
    }

    default: {
      return res.status(405);
    }
  }
};

export default handler;
