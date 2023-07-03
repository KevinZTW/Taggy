import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateRSSFeedRequest, RSSItem, RSSFeed } from '@/protos/taggy';
import RSSGateway from '@/gateways/rpc/RSS.gateway';

type TResponse = RSSFeed[];

const handler = async ({ method, body, query }: NextApiRequest, res: NextApiResponse<any>) => {
  switch (method) {
    case 'GET': {
      const { feedId = '' } = query;
      const { items = [] } = await RSSGateway.listRSSFeedItems(feedId as string);
      return res.status(200).json(items);
    }

    default: {
      return res.status(405);
    }
  }
};

export default handler;
