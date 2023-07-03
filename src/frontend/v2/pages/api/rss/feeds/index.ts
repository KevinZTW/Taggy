import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateRSSFeedRequest, RSSItem, RSSFeed } from '../../../../protos/taggy';
import RSSGateway from '../../../../gateways/rpc/RSS.gateway';

type TResponse = RSSFeed[];

const handler = async ({ method, body, query }: NextApiRequest, res: NextApiResponse<any>) => {
  switch (method) {
    case 'GET': {
      const feedId : string = query.feedId as string;
      if (feedId) {
        const { feed = {} } = await RSSGateway.getRSSFeed(feedId);
        return res.status(200).json(feed);
      }

      const { feeds = [] } = await RSSGateway.listRSSFeeds();
      return res.status(200).json(feeds);
    }

    case 'POST': {
      const { url } = body as CreateRSSFeedRequest;

      try {
        const { feed = {}} = await RSSGateway.addRSSFeed(url);
        return res.status(200).json(feed);
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
