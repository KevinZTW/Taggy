import { db } from "./firebase.js";

export const app = {};

app.checkTagUnderUser = function (name, uid) {
  return new Promise((resolve, reject) => {
    db.collection("Member")
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.data().tags) {
          let tags = doc.data().tags;
          for (let i in tags) {
            db.collection("Tags")
              .doc(tags[i])
              .get()
              .then((doc) => {
                if (doc.data().name === name) {
                  console.log(doc.data().name);
                  resolve("exist");
                } else {
                  resolve("notExsit");
                }
              });
          }
        } else {
          console.log("User dont have any tags");
        }
      });
  });
};
app.inputTag = function (tagName, articleId, uid) {
  app.checkTagUnderUser("React", "CLZ2a6gr6GN5a2CLvCba").then((a) => {
    if (a === "exist") {
      console.log("user already has this tag, ADD to ATICLE");
    } else {
      console.log("user dont have this tag, CREAT AND ADD to ARTICLE");
    }
  });
};
