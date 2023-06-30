import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateRSSSourceRequest, RSSItem, RSSSource } from '@/protos/taggy';
import RSSGateway from '@/gateways/rpc/RSS.gateway';

type TResponse = RSSSource[];

const handler = async ({ method, body, query }: NextApiRequest, res: NextApiResponse<any>) => {
  switch (method) {
    case 'GET': {
      
      const { itemId = '' } = query;
      console.log("itemId:", itemId);
      const { item = {} } = await RSSGateway.getRSSItem(itemId as string);
      return res.status(200).json(item);
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
