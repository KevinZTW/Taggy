import express from "express";
const rss_router = express.Router();

import { fetchRSS } from "../controllers/rss_controller.js";
rss_router.route("/rss/fetch").post((req, res) => {
  console.log("fetchrss", req.body);
  fetchRSS(req.body.url).then((feed) => {
    res.status(200).json({ rss: feed });
  });
});

export { rss_router };
