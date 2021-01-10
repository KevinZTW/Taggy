import greenlock from "greenlock-express";
import { app } from "./app.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import { loopAndFetchRSS } from "./service/fetchRSS.js";

setInterval(loopAndFetchRSS, 43200000); //half day
