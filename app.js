import express from "express";
export const app = express();
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";
import { article_router } from "./server/routes/article_route.js";
import { rss_router } from "./server/routes/rss_route.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/route", [article_router, rss_router]);

// Serve static files
app.use(express.static(path.join(__dirname, "client", "app", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/app/build", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
