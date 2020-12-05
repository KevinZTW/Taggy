import { db } from "../firebase.js";

const checkRSSItem = function (title, item) {
  return db
    .collection("RSSItem")
    .where("title", "==", title)
    .get()
    .then((snapShot) => {
      let titleList = [];
      snapShot.forEach((doc) => {
        titleList.push(doc.data().itemTitle);
      });
      console.log(titleList);
      console.log(item.title);

      if (titleList.includes(item.title)) {
        console.log("already in db");
        return false;
      } else console.log("check and not in db ");
      return true;
    });
};
const addRSS = function (feed, RSSId) {
  for (let i in feed.items) {
    checkRSSItem(feed.title, feed.items[i]).then((evaluate) => {
      console.log(evaluate);
      if (evaluate) {
        console.log("this feed not in db, let's save it ");
        db.collection("RSSItem")
          .add({
            RSSId: RSSId,
            content: feed.items[i].content || "null",
            contentSnippet: feed.items[i].contentSnippet || "null",
            RSS: feed.title || "null",
            title: feed.items[i].title || "null",
            creator: feed.items[i].creator || "null",
            guid: feed.items[i].guid || "null",
            isoDate: feed.items[i].isoDate || "null",
            link: feed.items[i].link || "null",
            pubDate: feed.items[i].pubDate || "null",
            author: feed.items[i].author || "null",
          })
          .then((docRef) => docRef.update({ id: docRef.id }))
          .then(console.log("store successfully!"));
      } else {
        console.log("already store this feed, let's skip");
      }
    });
  }
};

export { addRSS };
