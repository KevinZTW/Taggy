import Parser from "rss-parser";
import { RSS } from "../models/rss_model.js";
let parser = new Parser();

export async function fetchRSS(url) {
  let feed = await parser.parseURL(url);
  return feed;
}

export async function searchRSS(req, res) {
  console.log("search", req.body.keyWord);
  let RSSOutcome = await RSS.searchRSS(req.body.keyWord);

  let RSS_feed_format = RSSOutcome.map((feed) => {
    return {
      content: feed.FeedContent,
      contentSnippet: feed.FeedContentSnippet,
      title: feed.FeedTitle,
      pubDate: feed.FeedPubDate,
      link: feed.FeedLink,
    };
  });

  res.status(200).json({
    feed: {
      title: req.body.keyWord,
      description: `search outcome ${req.body.keyWord}`,
      items: RSS_feed_format,
    },
  });
}

export async function getUserSubscribedFeed(req, res) {
  const userUid = req.query.uid;
  let paging = 0;
  if (req.query.paging) paging = req.query.paging;
  let feeds = await RSS.getUserSubscribedFeed(userUid, paging).catch((err) =>
    console.log(err)
  );
  res.status(200).json({
    feeds,
  });
}

export async function getFeedTags(req, res) {
  const feedId = req.query.feedid;
  let data = await RSS.getFeedTags(feedId);
  res.status(200).json(data);
}
