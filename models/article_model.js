import { db } from "../firebase.js";

const addArticle = function (
  uid = "not login",
  title = "More Article",
  readerHtml = "reader html",
  markDown = "Mardown"
) {
  db.collection("Articles")
    .add({
      uid: uid,
      title: title,
      readerHtml: readerHtml,
      markDown: markDown,
    })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      docRef.update({ id: docRef.id });

      db.collection("Articles");
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
};

export { addArticle };
