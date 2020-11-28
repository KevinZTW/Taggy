import greenlock from "greenlock-express";

import * as store from "greenlock-store-fs";
import { app } from "./app.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

greenlock
  .init({
    packageRoot: __dirname,
    maintainerEmail: "kevin.zhang.tw@gmail.com", // The email address of the ACME user / hosting provider
    agreeTos: true, // You must accept the ToS as the host which handles the certs
    configDir: "./cert/", // Writable directory where certs will be saved
    // Using your express app:
    // simply export it as-is, then include it here
    store: store,
    //, debug: true
  })
  .serve(app);
