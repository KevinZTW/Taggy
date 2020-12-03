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
