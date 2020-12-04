import { addRSS } from "../models/rss_model.js";
import { db } from "../firebase.js";
import Parser from "rss-parser";

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
let saveRSSToDB = async function () {
  let RSSList = [];
  getRSSList().then((a) => (RSSList = a));
  console.log(RSSList);
};
let fetchRSS = function (url) {
  let parser = new Parser();

  (async () => {
    let feed = await parser.parseURL(url);
    console.log("get feed : ", feed.title);
    addRSS(feed);
  })();
};

export const loopAndFetchRSS = function () {
  getRSSList().then((list) => {
    list.forEach((item) => {
      fetchRSS(item.url);
    });
  });
};
