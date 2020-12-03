import { addRSS } from "../models/rss_model.js";
import { db } from "../firebase.js";
import Parser from "rss-parser";

let getRSSList = function () {
  db.collection("RSSFetchList")
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

let url = "https://rsshub.app/hackernews/best/comments";
// fetchRSS(url);
saveRSSToDB();
