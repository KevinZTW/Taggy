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

let fetchRSS = function (url, RSSId) {
  console.log("get url", url);
  let encodedUrl = encodeURI(url);
  let parser = new Parser();

  (async () => {
    let feed = await parser
      .parseURL(encodedUrl)
      .catch((err) => console.log(err));
    if (feed.items) {
      addRSS(feed, RSSId);
    }
  })();
};

export const loopAndFetchRSS = async function () {
  getRSSList().then((list) => {
    let timer = 1000;
    list.forEach((item) => {
      console.log(
        "stat to get ",
        item.title,
        "================================="
      );
      setTimeout(() => {
        fetchRSS(item.url, item.id);
      }, timer);
      timer += 10000;
    });
  });
};
