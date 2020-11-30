import { resolve } from "path";
import firebase from "firebase/app";
import { db, FieldValue } from "./firebase.js";

export const app = {};

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
                console.log("here 2");
                articleTags.push({
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
      .then((doc) => {
        if (doc.data()) {
          let tagIds = doc.data().tags;
          let memberTags = [];
          for (let i in tagIds) {
            db.collection("Tags")
              .doc(tagIds[i])
              .get()
              .then((doc) => {
                memberTags.push({
                  id: tagIds[i],
                  value: doc.data().name,
                  label: doc.data().name,
                });
              })
              .then(resolve(memberTags));
          }
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

  return articleTagSelection;
};

app.checkTagUnderUser = function (name, uid) {
  return new Promise((resolve, reject) => {
    db.collection("Member")
      .doc(uid)
      .get()
      .then((doc) => {
        console.log(uid);
        if (doc.data()) {
          let tags = doc.data().tags;
          for (let i in tags) {
            db.collection("Tags")
              .doc(tags[i])
              .get()
              .then((doc) => {
                if (doc.data().name === name) {
                  console.log(doc.data().name);
                  resolve(doc.data().id);
                } else {
                  resolve("notExist");
                }
              });
          }
        } else {
          console.log("User dont have any tags");
        }
      });
  });
};
app.inputTag = function (articleId, uid, tagName) {
  console.log(uid);
  app.checkTagUnderUser(tagName, uid).then((tagId) => {
    if (tagId !== "notExist") {
      console.log("user already has this tag, ADD ATICLE");
      db.collection("Tags")
        .doc(tagId)
        .update({
          articles: firebase.firestore.FieldValue.arrayUnion(articleId),
        });
      db.collection("Articles")
        .doc(articleId)
        .update({ tags: firebase.firestore.FieldValue.arrayUnion(tagId) });
    } else {
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
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  });
};
