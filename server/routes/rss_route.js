import express from "express";
import {
  getUserSubscribedFeed,
  getAllRSS,
  searchRSS,
  getFeedTags,
  syncRSS,
  syncFeeds,
} from "../controllers/rss_controller.js";

const rss_router = express.Router();

import { fetchRSS } from "../controllers/rss_controller.js";
rss_router.route("/rss/fetch").post((req, res) => {
  console.log("fetchrss", req.body);
  fetchRSS(req.body.url).then((feed) => {
    res.status(200).json({ rss: feed });
  });
});
rss_router.route("/rss").get(getAllRSS);
rss_router.route("/rss/syncfeed").get(syncFeeds);
rss_router.route("/rss/syncrss").get(syncRSS);
rss_router.route("/rss/search").post(searchRSS);
rss_router.route("/rss/userfeeds").get(getUserSubscribedFeed);
rss_router.route("/rss/feedtags").get(getFeedTags);
export { rss_router };
