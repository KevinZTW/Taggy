import React, { useEffect, useState } from "react";

import { db } from "../firebase.js";
import CardWrapper from "./CardWrapper.jsx";

import { useHistory } from "react-router-dom";
export default function Board(props) {
  let [cardlist, setCardList] = useState([]);
  let [user, setUser] = useState("");

  let history = useHistory();
  //===================deal with login flow============
  // const getUserData = function (userInfo) {
  //   console.log("userinfois", userInfo);
  //   setUser(userInfo.uid);
  //   console.log("might reset the user");
  // };
  // CheckFirebaseUserStatus("/signUp", getUserData);
  // console.log(user);
  //====================================================

  useEffect(() => {
    let mounted = true;
    console.log("user in board in use effect is ", props.user);
    function getArticles(uid) {
      console.log("on get article");
      db.collection("Articles")
        .where("uid", "==", uid)
        .get()
        .then(function (querySnapshot) {
          let list = [];
          querySnapshot.forEach(function (doc) {
            console.log(doc.data());
            list.push({
              title: doc.data().title,
              content: doc.data().markDown.slice(0, 100),
              id: doc.data().id,
            });
          });
          if (mounted === true) {
            setCardList(list);
          }
        });
    }
    function checkArticleUpdate(uid) {
      console.log("on snap shot");
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
    if (props.user.uid) {
      checkArticleUpdate(props.user.uid);
    }
    return () => (mounted = false);
  }, [props.user]);
  return (
    <div>
      <CardWrapper list={cardlist} />
    </div>
  );
}
