import { addRSS } from "../models/rss_model.js";
import { db } from "../firebase.js";
import Parser from "rss-parser";
import { response } from "express";
import { resolve } from "path";

let getRSSList = function () {
  return db
    .collection("RSSFetchList")
    .get()
    .then((querySnap) => {
      let RSSList = [];
      querySnap.forEach((doc) => {
        RSSList.push(doc.data());
      });
      return RSSList;
    });
};

let fetchRSS = function (url) {
  console.log("get url", url);
  let parser = new Parser();

  (async () => {
    let feed = await parser.parseURL(url).catch((err) => console.log(err));
    addRSS(feed);
  })();
};

export const loopAndFetchRSS = async function () {
  getRSSList().then((list) => {
    list.forEach((item) => {
      console.log("stat to get ", item.title);
      fetchRSS(item.url);
    });
  });
};
