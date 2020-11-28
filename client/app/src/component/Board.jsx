import React, { useEffect, useState } from "react";

import { db } from "../firebase.js";
import CardWrapper from "./CardWrapper.jsx";
import { CheckFirebaseUserStatus } from "../firebase.js";
// import { useHistory } from "react-router-dom";
export default function Board() {
  let [cardlist, setCardList] = useState([]);
  let list = [];
  // let history = useHistory();
  console.log("board render");
  CheckFirebaseUserStatus("/signup");
  useEffect(() => {
    function getArticles() {
      db.collection("Articles")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
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
