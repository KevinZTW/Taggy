import express from "express";
import {
  getUserSubscribedFeed,
  searchRSS,
} from "../controllers/rss_controller.js";

const rss_router = express.Router();

import { fetchRSS } from "../controllers/rss_controller.js";
rss_router.route("/rss/fetch").post((req, res) => {
  console.log("fetchrss", req.body);
  fetchRSS(req.body.url).then((feed) => {
    res.status(200).json({ rss: feed });
  });
});

rss_router.route("/rss/search").post(searchRSS);
rss_router.route("/rss/userfeeds").get(getUserSubscribedFeed);
export { rss_router };