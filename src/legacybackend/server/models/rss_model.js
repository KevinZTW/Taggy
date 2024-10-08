import { db } from "./firebaseconfig.js";
import { client, cache } from "../util/cache.js";

import dayjs from "dayjs";
import { query } from "./mysqlconfig.js";



export const getAllRSS = async function () {
  const sql = `SELECT * FROM RSS`;
  return await query(sql, []);
};

const getUserSubscribedFeed = async function (uid, paging) {
  const sql = `select Feed.FeedTitle AS title, RSS.RSSName AS RSS,Feed.FeedPubDate AS pubDate, Feed.FeedContentSnippet AS contentSnippet,Feed.FeedContent AS content, Feed.FeedLink AS link,Feed.FeedId AS FeedId from Feed join UserSubscription on Feed.RSSId = UserSubscription.RSSId join RSS 
	on Feed.RSSId = RSS.RSSId where UserSubscription.UserUID = '${uid}' order by Feed.FeedPubDate desc limit ${
    paging * 10
  },10;`;
  return await query(sql, []);
};

const getFeedTags = async function (feedId) {
  let redisReady = client.ready;
  let feedTagsCache;
  const sql = `select * from FeedKeyWords 
    JOIN KeyWord on FeedKeyWords.KeyWordId = KeyWord.KeyWordId
    JOIN Feed on Feed.FeedId = FeedKeyWords.FeedId
    where Feed.FeedId ='${feedId}'
  ;`;
  console.log("--------------------");
  console.log(redisReady);
  if (redisReady) {
    feedTagsCache = await cache.getFeedTagsCache(feedId);
  }
  if (feedTagsCache) {
    console.log("get Cache");
    return feedTagsCache;
  } else {
    return query(sql).then(async (result) => {
      if (result[0]) {
        const keyWordNameList = result.map((item) => item.KeyWordName);
        let keyWordId_Map = "";
        result.forEach((item) => {
          keyWordId_Map += `'${item.KeyWordId}',`;
        });
        keyWordId_Map = keyWordId_Map.slice(0, -1);

        let feeds = await query(`select Feed.FeedId AS FeedId, Feed.FeedTitle AS title, RSS.RSSName AS RSS,Feed.FeedPubDate AS pubDate, Feed.FeedContentSnippet AS contentSnippet,Feed.FeedContent AS content, Feed.FeedLink AS link, KeyWord.KeyWordName
      from Feed 
        JOIN FeedKeyWords on FeedKeyWords.FeedId = Feed.FeedId
        JOIN KeyWord on FeedKeyWords.KeyWordId = KeyWord.KeyWordId
        join RSS on Feed.RSSId = RSS.RSSId
        where KeyWord.KeyWordId  IN (${keyWordId_Map}) order by RAND() limit 5;`);
        cache.setFeedTagsCache(feedId, { feeds: feeds, tags: keyWordNameList });
        return { feeds: feeds, tags: keyWordNameList };
      } else {
        console.warn("no match feedtag in DB");
        return {};
      }
    });
  }
};
// getFeedTags("odFA1hV4UM1Vp8qgQhlP");
const searchRSS = async (keyWord) => {
  const sql = `SELECT * FROM Feed WHERE MATCH (FeedTitle, FeedContent) AGAINST ('${keyWord}' IN NATURAL LANGUAGE MODE);`;

  return await query(sql, []);
};

const checkRSSItemFirestore = function (item) {
  console.log("let check", item.guid);
  if (item.guid) {
    return db
      .collection("RSSItem")
      .where("guid", "==", item.guid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("check and not in db ");
          return "save";
        } else {
          console.log("already in db");
          return "skip";
        }
      });
  } else {
    console.log("Guid is not existed, check link ");
    return db
      .collection("RSSItem")
      .where("link", "==", item.link)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("check and not in db ");
          return "save";
        } else {
          console.log("already in db");
          return "skip";
        }
      });
  }
};

const addRSS = function (feed, RSSId) {
  if (feed) {
    for (let i in feed.items) {
      checkRSSItemFirestore(feed.items[i]).then((evaluate) => {
        if (evaluate === "save" && feed.items[i].content) {
          console.log("Saved RSSItem ", feed.items[i].title);
          let pubDate = dayjs(feed.items[i].pubDate).valueOf();
          
            db.collection("RSSItem")
              .add({
                RSSId: RSSId,
                content: feed.items[i].content || feed.items[i]["content:encoded"] || "",
                contentSnippet:   feed.items[i].contentSnippet  ||feed.items[i]["content:encodedSnippet"] ||"",
                RSS: feed.title|| "",
                title: feed.items[i].title|| "",
                creator: feed.items[i].creator|| "",
                guid: feed.items[i].guid || "",
                isoDate: feed.items[i].isoDate || "",
                link: feed.items[i].link || "",
                pubDate: pubDate || "",
                author: feed.items[i].author  || "",
              })
              .then((docRef) => docRef.update({ id: docRef.id }))
              .then(console.log("store successfully!"));
          
        } else {
          console.log("already store this feed, let's skip");
        }
      });
    }
  }
};

export const RSS = {
  getAllRSS: getAllRSS,
  searchRSS: searchRSS,
  getFeedTags: getFeedTags,
  getUserSubscribedFeed: getUserSubscribedFeed,
};
export { addRSS, searchRSS };
