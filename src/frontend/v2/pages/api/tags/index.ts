import type { NextApiRequest, NextApiResponse } from 'next';
import { GetRSSItemTagsRequest, GetRSSItemTagsReply } from '../../../protos/taggy';
import TaggingGateway from '../../../gateways/rpc/Tagging.gateway';


const handler = async ({ method, body, query }: NextApiRequest, res) => {
  switch (method) {
    case 'GET': {
      const itemId : string = query.itemId as string;
      if (itemId) {

        console.log("#listItemTags itemId: ", itemId);
        const { tags = [] } = await TaggingGateway.listItemTags(itemId);
        return res.status(200).json(tags);
      }
    }

    default: {
      return res.status(405);
    }
  }
};

export default handler;
