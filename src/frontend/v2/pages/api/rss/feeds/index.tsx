import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateRSSSourceRequest, RSSItem, RSSSource } from '@/protos/taggy';
import RSSGateway from '@/gateways/rpc/RSS.gateway';

type TResponse = RSSSource[];

const handler = async ({ method, body, query }: NextApiRequest, res: NextApiResponse<any>) => {
  switch (method) {
    case 'GET': {
      const { sourceId = '' } = query;
      const { feeds = [] } = await RSSGateway.listRSSSourceItems(sourceId as string);
      return res.status(200).json(feeds);
    }

    default: {
      return res.status(405);
    }
  }
};

export default handler;
