import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import firebase from "firebase/app";
import { db } from "../firebase.js";
import dayjs from "dayjs";

export const app = {
  db: {},
  article: {},
  member: {},
  util: {},
};

app.db.queryDoc = function (collection, docId) {
  return db
    .collection(collection)
    .doc(docId)
    .get()
    .then((doc) => {
      if (doc.data()) {
        return doc.data();
      } else {
        Promise.reject("No Data");
      }
    })
    .catch((err) => {});
};

app.article.getMemberTagFoldersDetail = async function (uid) {
  const getTagFolderIds = (uid) =>
    app.db.queryDoc("Member", uid).then((data) => data.articleFolders);

  const getTagFolderDetail = (id) => {
    return app.db.queryDoc("articleFolders", id).then((data) => {
      const { id, name, tags } = data;
      return {
        id: id,
        name: name,
        tags: tags,
      };
    });
  };
  const memberTagFolderIds = (await getTagFolderIds(uid)) || [];
  const memberTagFoldersDetail = memberTagFolderIds.map((id) => {
    return getTagFolderDetail(id);
  });
  return Promise.all(memberTagFoldersDetail);
};

app.article.deleteArticle = function (id, callback) {
  db.collection("Articles")
    .doc(id)
    .delete()
    .then(() => {
      callback();
    })
    .catch(function (error) {});
};

app.util.handleScrollBottom = (callback) => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;

  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  if (winScroll > height - 20) {
    callback();
  }
};

app.util.handleScroll = (fetchTime, setFetchTime) => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;

  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  if (winScroll > height - 20) {
    const newFetchTime = fetchTime + 1;
    setFetchTime(newFetchTime);
  }
};

app.getMemberFolderTags = function (folderId) {
  return new Promise((resolve, reject) => {
    db.collection("articleFolders")
      .doc(folderId)
      .get()
      .then(async (doc) => {
        if (doc.data()) {
          const tagIds = doc.data().tags;
          const folderTags = [];

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
          const tagIds = doc.data().tags;
          const memberTags = [];
          if (tagIds !== "" && tagIds) {
            for (const i in tagIds) {
              await db
                .collection("Tags")
                .doc(tagIds[i])
                .get()
                .then((doc) => {
                  memberTags.push({
                    tagId: tagIds[i],
                    value: doc.data().name,
                    label: doc.data().name,
                  });
                });
            }
          }

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

  return articleTagSelection;
};

app.checkTagUnderUser = function (name, uid) {
  return new Promise((resolve, reject) => {
    db.collection("Member")
      .doc(uid)
      .get()
      .then(async (doc) => {
        if (doc.data()) {
          const tags = doc.data().tags;

          if (tags) {
            for (const i in tags) {
              await db
                .collection("Tags")
                .doc(tags[i])
                .get()
                .then((doc) => {
                  if (doc.data().name === name) {
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
  app.checkTagUnderUser(tagName, uid).then((tagId) => {
    if (tagId === "noanytag") {
      db.collection("Tags")
        .add({
          name: tagName,
          articles: [articleId],
        })
        .then(function (docRef) {
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
        .catch(function (error) {});
    } else if (tagId === "notExist") {
      db.collection("Tags")
        .add({
          name: tagName,
          articles: [articleId],
        })
        .then(function (docRef) {
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
          db.collection("articleFolders")
            .doc("un" + uid)
            .update({ tags: firebase.firestore.FieldValue.arrayUnion(tagId) });
        });
    } else {
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
    db.collection("RSSFetchList")
      .where("url", "==", url)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          resolve(false);
        } else {
          snapshot.forEach((doc) => {
            if (doc.data()) {
              resolve(doc.data().id);
            } else {
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
        fetch("https://www.shopcard.site/route/rss/syncrss");
        return docRef.id;
      })
      .then((id) => resolve(id));
  });
};
app.checkUserHasUncaFolder = function (uid) {
  return new Promise((resolve, reject) => {
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
const notify_server_fail = () =>
  toast.dark(
    <div>Sorry... something goes wrong in backend..</div>,

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
              fetch(
                "https://www.shopcard.site/route/user/syncuserrsssubscription"
              )
                .then((res) => {
                  res.json().then((data) => {
                    notify_addRSS_success();
                    callback();
                  });
                })
                .catch(() => {
                  notify_server_fail();
                });
            });
        });
    } else {
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
              fetch(
                "https://www.shopcard.site/route/user/syncuserrsssubscription"
              );
            })
            .then(() => {
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
  app.checkRSSInFetchList(url).then((RSSId) => {
    if (RSSId) {
      app.addRSSToMember(uid, RSSId);
    } else {
      app.addRSSToFetchList(feed, url).then((RSSId) => {
        app.addRSSToMember(uid, RSSId);

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

      if (titleList.includes(item.title)) {
        return false;
      } else return true;
    });
};
app.addRSSItem = function (feed, RSSId) {
  for (const i in feed.items) {
    app.checkRSSItem(feed.title, feed.items[i]).then((evaluate) => {
      if (evaluate) {
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
          .then();
      } else {
      }
    });
  }
  setTimeout(() => {
    fetch("https://www.shopcard.site/route/rss/syncfeed");
  }, 3000);
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

          if (RSSFolderIds !== "" && RSSFolderIds) {
            for (const i in RSSFolderIds) {
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

      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          items.push({
            FeedId: doc.data().id,
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

          if (articleFolderIds !== "" && articleFolderIds) {
            for (const i in articleFolderIds) {
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
