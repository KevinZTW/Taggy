import express from "express";
const article_router = express.Router();

import { getArticle } from "../controllers/article_controller.js";
article_router.route("/article/import").post((req, res) => {
  let msg = getArticle(req.body.uid, req.body.url);
  res.status(200).json({ msg: "data sucessfully save in backend" });
});

export { article_router };
