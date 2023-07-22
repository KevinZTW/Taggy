import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateRSSFeedRequest, RSSItem, RSSFeed } from '@/protos/taggy';
import RSSGateway from '@/gateways/rpc/RSS.gateway';

type TResponse = RSSFeed[];

const handler = async ({ method, body, query }: NextApiRequest, res: NextApiResponse<any>) => {
  switch (method) {
    case 'GET': {
      
      const { itemId = '' } = query;
      console.log("#getRSSItem itemId:", itemId);
      const { item = {} } = await RSSGateway.getRSSItem(itemId as string);
      return res.status(200).json(item);
    }

    // case 'POST': {
    //     const { url } = body as CreateRSSFeedRequest;
    //     const RSSFeed = await RSSGateway.addRSSFeed(url);
    //     return res.status(200).json(rssFeed);
    // }

    default: {
      return res.status(405);
    }
  }
};

export default handler;
