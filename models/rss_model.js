import { db } from "../firebase.js";
const getRSSFetchList = function () {
  db.collection("RSSFetchList")
    .get()
    .then(async (querySnap) => {
      let fetchList = [];
      await querySnap.forEach((doc) => {
        fetchList.push({
          title: doc.data().title,
          url: doc.data().url,
        });
      });
      return fetchList;
    });
};

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
      console.log(titleList.includes(item.title));
      if (titleList.includes(item.title)) {
        console.log("already in db");
        return false;
      } else console.log("check and not in db ");
      return true;
    });
};
const addRSS = function (feed) {
  for (let i in feed.items) {
    checkRSSItem(feed.title, feed.items[i]).then((evaluate) => {
      console.log(evaluate);
      if (evaluate) {
        console.log("this feed not in db, let's save it ");
        db.collection("RSSItem")
          .add({
            item: feed.items[i],
            title: feed.title,
            itemTitle: feed.items[i].title,
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
