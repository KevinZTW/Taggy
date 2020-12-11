import { db } from "../firebase.js";
import OpenCC from "opencc";
import dayjs from "dayjs";

let test = Date.now();
let test2 = dayjs(test).valueOf();
console.log(test2);
const converter = new OpenCC("s2t.json");
const checkRSSItem = function (item) {
  console.log("let check", item.guid);
  return db
    .collection("RSSItem")
    .where("guid", "==", item.guid)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("check and not in db ");
        return true;
      } else {
        console.log("already in db");
        return false;
      }
    });
};
async function translation(a, b, c, d, e) {
  let converteda = await converter.convertPromise(a);
  let convertedb = await converter.convertPromise(b);
  let convertedc = await converter.convertPromise(c);
  let convertedd = await converter.convertPromise(d);
  let convertede = await converter.convertPromise(e);
  console.log([converteda, convertedb, convertedc, convertedd, convertede]);
  return [converteda, convertedb, convertedc, convertedd, convertede];
}
const addRSS = function (feed, RSSId) {
  for (let i in feed.items) {
    checkRSSItem(feed.items[i]).then((evaluate) => {
      if (evaluate && feed.items[i].content) {
        console.log("Saved RSSItem ", feed.items[i].title);
        let pubDate = dayjs(feed.items[i].pubDate).valueOf();
        translation(
          feed.items[i].content || "",
          feed.items[i].contentSnippet || "",
          feed.title || "",
          feed.items[i].title || "",
          feed.items[i].creator || "",
          feed.items[i].author || ""
        ).then((converted) => {
          db.collection("RSSItem")
            .add({
              RSSId: RSSId,
              content: converted[0] || "",
              contentSnippet: converted[1] || "",
              RSS: converted[2] || "",
              title: converted[3] || "",
              creator: converted[4] || "",
              guid: feed.items[i].guid || "",
              isoDate: feed.items[i].isoDate || "",
              link: feed.items[i].link || "",
              pubDate: pubDate || "",
              author: converted[5] || "",
            })
            .then((docRef) => docRef.update({ id: docRef.id }))
            .then(console.log("store successfully!"));
        });
      } else {
        console.log("already store this feed, let's skip");
      }
    });
  }
};

export { addRSS };
