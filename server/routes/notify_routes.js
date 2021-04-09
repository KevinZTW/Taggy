import express from "express";
import { db } from "../models/firebaseconfig.js";

const notify_router = express.Router();

notify_router.route("/notify").post(function (req, res) {
  console.log("get post notify");
  console.log(req.url);
  db.collection("aliNotifyTest").add({
    method: "post",
    url: req.url,
  });
});

notify_router.route("/notify").get(function (req, res) {
  console.log("get get notify");
  console.log(req.url);
  db.collection("aliNotifyTest").add({
    method: "get",
    url: req.url,
  });
});

notify_router.route("/notify").put(function (req, res) {
  console.log("get put notify");
  console.log(req.url);
  db.collection("aliNotifyTest").add({
    method: "put",
    url: req.url,
  });
});

export { notify_router };
