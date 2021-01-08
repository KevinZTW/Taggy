import greenlock from "greenlock-express";
import { app } from "./app.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import { loopAndFetchRSS } from "./service/fetchRSS.js";

// greenlock
//   .init({
//     packageRoot: __dirname,
//     configDir: "./greenlock.d",
//     maintainerEmail: "kevin.zhang.tw@gmail.com", // The email address of the ACME user / hosting provider
//     agreeTos: true, // You must accept the ToS as the host which handles the certs
//     // Using your express app:
//     // simply export it as-is, then include it here
//     //, debug: true
//   })
//   .serve(app);

// setInterval(loopAndFetchRSS, 43200000); //half day
