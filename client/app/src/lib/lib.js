import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import firebase from "firebase/app";

import { db } from "../firebase.js";
import dayjs from "dayjs";

export const app = {
  db: {},
  article: {},
  member: {},
};

app.db.queryDoc = function (collection, docId, callback) {
  return db
    .collection(collection)
    .doc(docId)
    .get()
    .then((doc) => {
      if (doc.data()) {
        callback(doc);
      } else {
        Promise.reject("No Data");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

app.article.getMemberTagFoldersDetail = async function (uid) {
  const memberTagFolderIds = await app.member.getMemberTagFolderIds(uid);
  const memberTagFoldersDetail = memberTagFolderIds.map((id) => {});
};

app.member.getMemberTagFolderIds = function (uid) {
  return app.db.queryDoc("Member", uid, (doc) => {
    return doc.data().articleFolders;
  });
};

const id = app.member.getMemberTagFolderIds("testUser");
console.error(id);

app.getMemberArticleFolders = function (uid) {
  return new Promise((resolve, reject) => {
    app.db
      .queryDoc("Member", uid)
      .then(async (doc) => {
        if (doc.data()) {
          const articleFolderIds = doc.data().articleFolders;
          const articleFolders = [];
          if (articleFolderIds !== "" && articleFolderIds) {
            await db
              .collection("articleFolders")
              .where("id", "in", articleFolderIds)
              .get()
              .then((snapShot) => {
                articleFolderIds.forEach((Id) => {
                  snapShot.forEach((doc) => {
                    if (doc.data().id === Id) {
                      articleFolders.push({
                        id: doc.data().id,
                        name: doc.data().name,
                        tags: doc.data().tags,
                      });
                    }
                  });
                });
              });
          }
          resolve(articleFolders);
        } else resolve("dont have this user");
      })
      .catch((e) => {
        console.log(e);
        console.log("haha failed");
      });
  });
};
app.getMemberFolderTags = function (folderId) {
  return new Promise((resolve, reject) => {
    console.log("start to get ");
    db.collection("articleFolders")
      .doc(folderId)
      .get()
      .then(async (doc) => {
        if (doc.data()) {
          const tagIds = doc.data().tags;
          const folderTags = [];
          console.log(tagIds);
          if (tagIds && tagIds[0]) {
            await db
              .collection("Tags")
              .where("id", "in", tagIds)
              .get()
              .then((snapshot) => {
                tagIds.forEach((id) => {
                  snapshot.forEach((doc) => {
                    if (doc.data().id === id) {
                      folderTags.push({
                        id: doc.data().id,
                        value: doc.data().name,
                        label: doc.data().name,
                      });
                    }
                  });
                });
              });
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
        const tags = doc.data().tags;

        const articleTags = [];
        if (tags) {
          for (const i in tags) {
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
    console.log(uid);
    db.collection("Member")
      .doc(uid)
      .get()
      .then(async (doc) => {
        console.log(doc.data());
        if (doc.data()) {
          const tagIds = doc.data().tags;
          const memberTags = [];
          console.log(tagIds);
          if (tagIds !== "" && tagIds) {
            for (const i in tagIds) {
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
  const articleTagSelection = {};
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
          const tags = doc.data().tags;
          console.log(tags);
          if (tags) {
            for (const i in tags) {
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
            .doc("un" + uid)
            .set({
              id: "un" + uid,
              name: "Uncategorized",
              tags: firebase.firestore.FieldValue.arrayUnion(tagId),
            })
            .then(() => {
              db.collection("Member")
                .doc(uid)
                .update({
                  articleFolders: firebase.firestore.FieldValue.arrayUnion(
                    "un" + uid
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
app.addRSSToFetchList = function (feed, url) {
  return new Promise((resolve, reject) => {
    db.collection("RSSFetchList")
      .add({
        title: feed.title || "null",
        url: url || "null",
        link: feed.link || "null",
        description: feed.description || "null",
        img: (feed.image || {}).url || "null",
        lastUpdate: feed.lastBuildDate || "null",
      })
      .then((docRef) => {
        docRef.update({ id: docRef.id });
        return docRef.id;
      })
      .then((id) => resolve(id));
  });
};
app.checkUserHasUncaFolder = function (uid) {
  return new Promise((resolve, reject) => {
    console.log(uid);
    db.collection("Member")
      .doc(uid)
      .get()
      .then((doc) => {
        if (
          doc.data().RSSFolders &&
          doc.data().RSSFolders.includes("unCa_" + uid)
        ) {
          resolve(true);
        } else resolve(false);
      });
  });
};
const notify_addRSS_success = () =>
  toast.dark(
    <div>
      successfully subscribte the RSS{" "}
      <Link to="/home/myfeeds">check it in feeds</Link>
    </div>,

    {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );
app.addRSSToMember = function (uid, feedId, callback) {
  return new Promise(async (resolve, reject) => {
    if (!(await app.checkUserHasUncaFolder(uid))) {
      console.log("user dont have unCat folder, create and as RSS to it ");
      db.collection("RSSFolders")
        .doc("unCa_" + uid)
        .set({
          uid: uid,
          name: "Uncategorized",
          RSS: firebase.firestore.FieldValue.arrayUnion(feedId),
          id: "unCa_" + uid,
        })
        .then((folderId) => {
          db.collection("Member")
            .doc(uid)
            .update({
              subscribedRSS: firebase.firestore.FieldValue.arrayUnion(feedId),
              RSSFolders: firebase.firestore.FieldValue.arrayUnion(
                "unCa_" + uid
              ),
            })
            .then(() => {
              console.log("successfully add to user");
              notify_addRSS_success();
              callback();
            });
        });
    } else {
      console.log("user already has unCat folder, as RSS to it ");
      db.collection("RSSFolders")
        .doc("unCa_" + uid)
        .update({
          RSS: firebase.firestore.FieldValue.arrayUnion(feedId),
        })
        .then((folderId) => {
          db.collection("Member")
            .doc(uid)
            .update({
              subscribedRSS: firebase.firestore.FieldValue.arrayUnion(feedId),
            })
            .then(() => {
              console.log("successfully add to user");
              notify_addRSS_success();
              if (typeof callback === "function") {
                callback();
              }
            });
        });
    }
  });
};

app.subscribeRSS = async function (uid, title, url, feed) {
  console.log("hihi");
  console.log("add to ", uid, title, url);
  app.checkRSSInFetchList(url).then((RSSId) => {
    if (RSSId) {
      console.log("RSS already in Fetch List");
      app.addRSSToMember(uid, RSSId);
    } else {
      console.log("Add RSS to fetch List");
      app.addRSSToFetchList(feed, url).then((RSSId) => {
        console.log("add RSS to member");
        app.addRSSToMember(uid, RSSId);
        console.log("Add feed to RSSItem");
        app.addRSSItem(feed, RSSId);
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
      const titleList = [];
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
app.addRSSItem = function (feed, RSSId) {
  for (const i in feed.items) {
    app.checkRSSItem(feed.title, feed.items[i]).then((evaluate) => {
      console.log(evaluate);
      if (evaluate) {
        console.log("this feed not in db, let's save it ");
        db.collection("RSSItem")
          .add({
            RSSId: RSSId,
            content:
              feed.items[i].content || feed.items[i]["content:encoded"] || "",
            contentSnippet:
              feed.items[i].contentSnippet ||
              feed.items[i]["content:encodedSnippet"] ||
              feed.items[i].media[0]["media:description"][0],
            RSS: feed.title || "",
            title: feed.items[i].title || "",
            creator: feed.items[i].creator || "",
            guid: feed.items[i].guid || "",
            isoDate: feed.items[i].isoDate || "",
            link: feed.items[i].link || "",
            pubDate: dayjs(feed.items[i].pubDate).valueOf() || "",
            author: feed.items[i].author || "",
            media: feed.items[i].media || "",
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
          const RSSFolderIds = doc.data().RSSFolders;
          const RSSFolders = [];
          console.log(RSSFolderIds);
          if (RSSFolderIds !== "" && RSSFolderIds) {
            for (const i in RSSFolderIds) {
              console.log(RSSFolderIds[i]);
              await db
                .collection("RSSFolders")
                .doc(RSSFolderIds[i])
                .get()
                .then((doc) => {
                  RSSFolders.push({
                    id: doc.data().id,
                    name: doc.data().name,
                    RSSIds: doc.data().RSS || [],
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
    db.collection("RSSFetchList")
      .doc(RSSId)
      .get()
      .then(async (doc) => {
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
app.getChannelFeeds = function (RSSId) {
  return new Promise((resolve, reject) => {
    const items = [];
    db.collection("RSSItem")
      .where("RSSId", "==", RSSId)
      // .orderBy("isoDate", "desc")
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          items.push({
            RSSId: doc.data().RSSId,
            content: doc.data().content,
            contentSnippet: doc.data().contentSnippet,
            RSS: doc.data().RSS,
            title: doc.data().title,
            creator: doc.data().creator,
            guid: doc.data().guid,
            isoDate: doc.data().isoDate,
            link: doc.data().link,
            pubDate: doc.data().pubDate,
            author: doc.data().author,
          });
        });
        resolve(items);
      });
  });
};
app.getFeedContent = function (feedId) {
  return new Promise((resolve, reject) => {
    db.collection("RSSItem")
      .doc(feedId)
      .get()
      .then((doc) => {
        resolve({
          RSSId: doc.data().RSSId,
          content: doc.data().content,
          contentSnippet: doc.data().contentSnippet,
          RSS: doc.data().RSS,
          title: doc.data().tilte,
          creator: doc.data().creator,
          guid: doc.data().guid,
          isoDate: doc.data().isoDate,
          link: doc.data().link,
          pubDate: doc.data().pubDate,
          author: doc.data().author,
        });
      });
  });
};

app.getGroupArticleFolders = function (uid) {
  return new Promise((resolve, reject) => {
    db.collection("GroupBoard")
      .doc(uid)
      .get()
      .then(async (doc) => {
        if (doc.data()) {
          const articleFolderIds = doc.data().articleFolders;
          const articleFolders = [];
          console.log(articleFolderIds);
          if (articleFolderIds !== "" && articleFolderIds) {
            for (const i in articleFolderIds) {
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
