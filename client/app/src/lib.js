import { resolve } from "path";
import firebase from "firebase/app";
import { db, FieldValue } from "./firebase.js";

export const app = {};
app.getMemberArticleFolders = function (uid) {
  return new Promise((resolve, reject) => {
    db.collection("Member")
      .doc(uid)
      .get()
      .then(async (doc) => {
        if (doc.data()) {
          let articleFolderIds = doc.data().articleFolders;
          let articleFolders = [];
          console.log(articleFolderIds);
          if (articleFolderIds !== "" && articleFolderIds) {
            for (let i in articleFolderIds) {
              console.log(articleFolderIds[i]);
              await db
                .collection("articleFolders")
                .doc(articleFolderIds[i])
                .get()
                .then((doc) => {
                  articleFolders.push({
                    id: doc.data().id,
                    name: doc.data().name,
                    tags: doc.data().tags,
                  });
                });
            }
          }
          resolve(articleFolders);
        } else resolve("dont have this user");
      });
  });
};
app.getMemberFolderTags = function (folderId) {
  return new Promise((resolve, reject) => {
    db.collection("articleFolders")
      .doc(folderId)
      .get()
      .then(async (doc) => {
        if (doc.data()) {
          let tagIds = doc.data().tags;
          let folderTags = [];
          console.log(tagIds);
          if (tagIds !== "" && tagIds) {
            for (let i in tagIds) {
              console.log(tagIds[i]);
              await db
                .collection("Tags")
                .doc(tagIds[i])
                .get()
                .then((doc) => {
                  folderTags.push({
                    id: tagIds[i],
                    value: doc.data().name,
                    label: doc.data().name,
                  });
                });
            }
          }
          resolve(folderTags);
        } else resolve("");
      });
  });
};

app.getArticleTags = function (articleId) {
  return new Promise((resolve, reject) => {
    db.collection("Articles")
      .doc(articleId)
      .get()
      .then((doc) => {
        let tags = doc.data().tags;

        let articleTags = [];
        if (tags) {
          for (let i in tags) {
            db.collection("Tags")
              .doc(tags[i])
              .get()
              .then((doc) => {
                console.log(doc.data());
                articleTags.push({
                  tagId: tags[i],
                  label: doc.data().name,
                  value: doc.data().name,
                });
              });
            resolve(articleTags);
          }
        } else {
          resolve("");
        }
      });
  });
};

app.getMemberTags = function (uid) {
  return new Promise((resolve, reject) => {
    db.collection("Member")
      .doc(uid)
      .get()
      .then(async (doc) => {
        if (doc.data()) {
          let tagIds = doc.data().tags;
          let memberTags = [];
          console.log(tagIds);
          if (tagIds !== "" && tagIds) {
            for (let i in tagIds) {
              console.log(tagIds[i]);
              await db
                .collection("Tags")
                .doc(tagIds[i])
                .get()
                .then((doc) => {
                  memberTags.push({
                    id: tagIds[i],
                    value: doc.data().name,
                    label: doc.data().name,
                  });
                });
            }
          }
          console.log(memberTags);
          resolve(memberTags);
        } else resolve("");
      });
  });
};

app.initArticleTags = async function (articleId, uid) {
  let articleTagSelection = {};
  await app.getArticleTags(articleId).then((articleTags) => {
    articleTagSelection.values = articleTags;
  });
  await app.getMemberTags(uid).then((memberTags) => {
    articleTagSelection.options = memberTags;
  });
  console.log(articleTagSelection);
  return articleTagSelection;
};

app.checkTagUnderUser = function (name, uid) {
  return new Promise((resolve, reject) => {
    db.collection("Member")
      .doc(uid)
      .get()
      .then(async (doc) => {
        console.log(uid);
        if (doc.data()) {
          let tags = doc.data().tags;
          console.log(tags);
          if (tags) {
            for (let i in tags) {
              await db
                .collection("Tags")
                .doc(tags[i])
                .get()
                .then((doc) => {
                  if (doc.data().name === name) {
                    console.log(doc.data().name);
                    console.log("resolve the id");
                    resolve(doc.data().id);
                  }
                });
            }
            resolve("notExist");
          } else {
            resolve("noanytag");
          }
        } else {
          resolve("nothisuser");
        }
      });
  });
};
app.inputTag = function (articleId, uid, tagName) {
  console.log(uid);
  app.checkTagUnderUser(tagName, uid).then((tagId) => {
    console.log(tagId);
    if (tagId === "noanytag") {
      db.collection("Tags")
        .add({
          name: tagName,
          articles: [articleId],
        })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);

          docRef.update({ id: docRef.id });
          return docRef.id;
        })
        .then((tagId) => {
          db.collection("Articles")
            .doc(articleId)
            .update({ tags: firebase.firestore.FieldValue.arrayUnion(tagId) });
          return tagId;
        })
        .then((tagId) => {
          db.collection("Member")
            .doc(uid)
            .update({ tags: [tagId] });
          return tagId;
        })
        .then((tagId) => {
          db.collection("articleFolders")
            .add({
              name: "Uncategorized",
              tags: firebase.firestore.FieldValue.arrayUnion(tagId),
            })
            .then((docRef) => {
              docRef.update({ id: docRef.id });
              return docRef.id;
            })
            .then((folderId) => {
              db.collection("Member")
                .doc(uid)
                .update({
                  articleFolders: firebase.firestore.FieldValue.arrayUnion(
                    folderId
                  ),
                });
            });
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    } else if (tagId === "notExist") {
      console.log("user dont have this tag, CREAT AND ADD to ARTICLE");
      db.collection("Tags")
        .add({
          name: tagName,
          articles: [articleId],
        })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);

          docRef.update({ id: docRef.id });
          return docRef.id;
        })
        .then((tagId) => {
          db.collection("Articles")
            .doc(articleId)
            .update({ tags: firebase.firestore.FieldValue.arrayUnion(tagId) });
          return tagId;
        })
        .then((tagId) => {
          db.collection("Member")
            .doc(uid)
            .update({ tags: firebase.firestore.FieldValue.arrayUnion(tagId) });
          return tagId;
        })
        .then((tagId) => {
          console.log("tag add to :", "un" + uid, "value is", tagId);
          db.collection("articleFolders")
            .doc("un" + uid)
            .update({ tags: firebase.firestore.FieldValue.arrayUnion(tagId) });
        })

        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    } else {
      console.log("user already has this tag, ADD ATICLE");
      db.collection("Tags")
        .doc(tagId)
        .update({
          articles: firebase.firestore.FieldValue.arrayUnion(articleId),
        });
      db.collection("Articles")
        .doc(articleId)
        .update({ tags: firebase.firestore.FieldValue.arrayUnion(tagId) });
    }
  });
};
app.deleteTagFromArticle = function (articleId, uid, tagId) {
  db.collection("Articles")
    .doc(articleId)
    .update({ tags: firebase.firestore.FieldValue.arrayRemove(tagId) });
};

app.checkRSSInFetchList = function (url) {
  return new Promise((resolve, reject) => {
    console.log(url);
    db.collection("RSSFetchList")
      .where("url", "==", url)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("not in fetch list");
          resolve(false);
        } else {
          snapshot.forEach((doc) => {
            if (doc.data()) {
              console.log("already id fetch list, the id is:");
              resolve(doc.data().id);
            } else {
              console.log("sth pretty weird happened");
            }
          });
        }
      });
  });
};
app.addRSSToFetchList = function (title, url) {
  return new Promise((resolve, reject) => {
    db.collection("RSSFetchList")
      .add({
        title: title,
        url: url,
      })
      .then((docRef) => {
        docRef.update({ id: docRef.id });
        console.log("1");
        return docRef.id;
      })
      .then((id) => resolve(id));
  });
};
app.checkUserHasFolder = function (uid) {
  return new Promise((resolve, reject) => {
    console.log(uid);
    db.collection("Member")
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.data().RSSFolders) {
          resolve(true);
        } else resolve(false);
      });
  });
};

app.addRSSToMember = function (uid, feedId) {
  return new Promise(async (resolve, reject) => {
    if (!(await app.checkUserHasFolder(uid))) {
      db.collection("RSSFolders")
        .add({
          name: "Uncategorized",
          RSS: firebase.firestore.FieldValue.arrayUnion(feedId),
        })
        .then((docRef) => {
          docRef.update({ id: docRef.id });
          return docRef.id;
        })
        .then((folderId) => {
          db.collection("Member")
            .doc(uid)
            .update({
              subscribedRSS: firebase.firestore.FieldValue.arrayUnion(feedId),
              RSSFolders: firebase.firestore.FieldValue.arrayUnion(folderId),
            })
            .then(console.log("successfully add to user"));
        });
    } else {
    }
  });
};

app.subscribeRSS = async function (uid, title, url, feed) {
  console.log("add to ", uid, title, url);
  app.checkRSSInFetchList(url).then((feedId) => {
    if (feedId) {
      console.log("RSS already in Fetch List");
      app.addRSSToMember(uid, feedId);
    } else {
      console.log("Add feed to RSSItem");
      app.addRSSItem(feed);
      console.log("Add RSS to fetch List");
      app.addRSSToFetchList(title, url).then((feedId) => {
        console.log("add RSS to member");
        app.addRSSToMember(uid, feedId);
      });
    }
  });
};
app.checkRSSItem = function (title, item) {
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
app.addRSSItem = function (feed) {
  for (let i in feed.items) {
    app.checkRSSItem(feed.title, feed.items[i]).then((evaluate) => {
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
app.getMemberRSSFolders = function (uid) {
  return new Promise((resolve, reject) => {
    db.collection("Member")
      .doc(uid)
      .get()
      .then(async (doc) => {
        if (doc.data()) {
          let RSSFolderIds = doc.data().RSSFolders;
          let RSSFolders = [];
          console.log(RSSFolderIds);
          if (RSSFolderIds !== "" && RSSFolderIds) {
            for (let i in RSSFolderIds) {
              console.log(RSSFolderIds[i]);
              await db
                .collection("RSSFolders")
                .doc(RSSFolderIds[i])
                .get()
                .then((doc) => {
                  RSSFolders.push({
                    id: doc.data().id,
                    name: doc.data().name,
                    RSSIds: doc.data().RSS,
                    RSS: [],
                  });
                });
            }
          }
          resolve(RSSFolders);
        } else resolve("dont have this user");
      });
  });
};
app.getRSSInfo = function (RSSId) {
  return new Promise((resolve, reject) => {
    console.log(RSSId);
    db.collection("RSSFetchList")
      .doc(RSSId)
      .get()
      .then(async (doc) => {
        console.log("hey", doc.data());
        if (doc.data()) {
          resolve({
            id: doc.data().id,
            title: doc.data().title,
            url: doc.data().url,
          });
        }
      });
  });
};
