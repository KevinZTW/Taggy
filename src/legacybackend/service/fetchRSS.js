import { addRSS } from "../server/models/rss_model.js";
import { db } from "../server/models/firebaseconfig.js";
import Parser from "rss-parser";
import { Sync } from "../server/models/firestore_sync.js";
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
    let feed = await parser.parseURL(encodedUrl).catch(async (err) => {
      console.log(err);

      return await parser.parseURL(url);
    });
    if (feed && feed.items) {
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
      timer += 1000;
    });

    setTimeout(() => {
      console.log("start to sync items...");
      Sync.Feeds();
    }, 40000);
  });
};
