import express from "express";
var app = express();
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
import cors from "cors";
import { article_router } from "./routes/article_route.js";
app.use(cors());

app.use("/route", [article_router]);

// Serve static files
app.use(express.static(path.join(__dirname, "client", "app", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/app/build", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
