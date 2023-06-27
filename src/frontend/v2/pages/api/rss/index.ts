import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateRSSSourceRequest, RSSFeed, RSSSource } from '../../../protos/taggy';
import RSSGateway from '../../../gateways/rpc/RSS.gateway';

type TResponse = RSSSource[];

const handler = async ({ method, body, query }: NextApiRequest, res) => {
  switch (method) {
    case 'GET': {
      const sourceId : string = query.sourceId as string;
      if (sourceId) {
        const { source = {} } = await RSSGateway.getRSSSource(sourceId);
        return res.status(200).json(source);
      }

      const { rssSources = [] } = await RSSGateway.listRSSSources();
      return res.status(200).json(rssSources);
    }

    case 'POST': {
      const { url } = body as CreateRSSSourceRequest;

      try {
        const { source = {}} = await RSSGateway.addRSSSource(url);
        return res.status(200).json(source);
      }catch(err) {
        console.log(err);
        return res.status(404).json({error: err});
      }   
    }

    default: {
      return res.status(405);
    }
  }
};

export default handler;
