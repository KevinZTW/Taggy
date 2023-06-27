import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateRSSSourceRequest, RSSFeed, RSSSource } from '@/protos/taggy';
import RSSGateway from '@/gateways/rpc/RSS.gateway';

type TResponse = RSSSource[];

const handler = async ({ method, body, query }: NextApiRequest, res: NextApiResponse<any>) => {
  switch (method) {
    case 'GET': {
      
      const { feedId = '' } = query;
      console.log("feedId:", feedId);
      const { feed = {} } = await RSSGateway.getRSSFeed(feedId as string);
      return res.status(200).json(feed);
    }

    // case 'POST': {
    //     const { url } = body as CreateRSSSourceRequest;
    //     const rssSource = await RSSGateway.addRSSSource(url);
    //     return res.status(200).json(rssSource);
    // }

    default: {
      return res.status(405);
    }
  }
};

export default handler;
