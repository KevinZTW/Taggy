import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateRSSSourceRequest, RSSFeed, RSSSource } from '@/protos/taggy';
import RSSGateway from '@/gateways/rpc/RSS.gateway';

type TResponse = RSSSource[];

const handler = async ({ method, body, query }: NextApiRequest, res: NextApiResponse<any>) => {
  switch (method) {
    case 'GET': {
      const { sourceId = '' } = query;
      const { feeds = [] } = await RSSGateway.listRSSSourceFeeds(sourceId as string);
      return res.status(200).json(feeds);
    }

    default: {
      return res.status(405);
    }
  }
};

export default handler;
