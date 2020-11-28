import React, { useEffect, useState } from "react";

import { db } from "../firebase.js";
import CardWrapper from "./CardWrapper.jsx";
export default function Main() {
  let [cardlist, setCardList] = useState([]);
  let list = [];

  useEffect(() => {
    function getArticles() {
      db.collection("Articles")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            console.log(doc.data());
            // doc.data() is never undefined for query doc snapshots
            list.push({
              title: doc.data().title,
              content: doc.data().content.slice(0, 100),
              id: doc.data().id,
            });
          });
          setCardList(list);
        });
    }
    getArticles();
  }, []);

  return (
    <div>
      <CardWrapper list={cardlist} />
    </div>
  );
}
