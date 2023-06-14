import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateRSSSourceRequest, RSSFeed, RSSSource } from '../../../protos/taggy';
import RSSGateway from '../../../gateways/rpc/RSS.gateway';

type TResponse = RSSSource[];

const handler = async ({ method, body }: NextApiRequest, res) => {
  switch (method) {
    case 'GET': {
      const { rssSources = [] } = await RSSGateway.listRssSources();
      return res.status(200).json(rssSources);
    }

    case 'POST': {
        const { url } = body as CreateRSSSourceRequest;
        const rssSource = await RSSGateway.addRssSource(url);
        return res.status(200).json(rssSource);
    }
    
    default: {
      return res.status(405);
    }
  }
};

export default handler;
