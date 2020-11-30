import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase.js";
import CardWrapper from "./CardWrapper.jsx";

export default function Board(props) {
  let [cardlist, setCardList] = useState([]);

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  useEffect(() => {
    function checkArticleUpdate(uid) {
      db.collection("Articles")
        .where("uid", "==", uid)
        .onSnapshot(function (querySnapshot) {
          let list = [];
          querySnapshot.forEach(function (doc) {
            list.push({
              title: doc.data().title,
              content: doc.data().markDown.slice(0, 100),
              id: doc.data().id,
            });
          });
          setCardList(list);
        });
    }
    if (user) {
      checkArticleUpdate(user.uid);
    }
  }, [user]);
  return (
    <div>
      <CardWrapper list={cardlist} />
    </div>
  );
}
