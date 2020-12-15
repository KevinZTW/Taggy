import { db } from "../firebase.js";

const addArticle = function (
  uid = "not login",
  title = "More Article",
  readerHtml = "reader html",
  markdown,
  link
) {
  console.log(
    "===========================================^^^^^^^^^^^========="
  );
  console.log(uid);
  if (uid[0]) {
    uid.forEach((i) => {
      console.log("try to add", i, title, readerHtml, markdown, link);
      db.collection("Articles")
        .add({
          uid: i,
          title: title,
          link: link,
          readerHtml: readerHtml,
          markDown: markdown,
          date: Date.now(),
        })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
          docRef.update({ id: docRef.id });
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    });
  } else {
    console.log("try to add", uid, title, readerHtml, markdown, link);
    db.collection("Articles")
      .add({
        uid: uid,
        title: title,
        link: link,
        readerHtml: readerHtml,
        markDown: markdown,
        date: Date.now(),
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        docRef.update({ id: docRef.id });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }
};

export { addArticle };
