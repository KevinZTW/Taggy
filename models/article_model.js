import { db } from "../firebase.js";

const addArticle = function (title = "More Article", content = "No Content") {
  console.log("title is :", title, "content is ", content);
  db.collection("Articles")
    .add({
      title: title,
      content: content,
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
