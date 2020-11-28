import express from "express";
var app = express();
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
import cors from "cors";
import { article_router } from "./routes/article_route.js";
app.use(cors());

app.use("/route", [article_router]);

app.listen(2000, () => {
  console.log("port run on 2000");
});
