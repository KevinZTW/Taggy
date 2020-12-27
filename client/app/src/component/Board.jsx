import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase.js";
import CardWrapper from "./CardWrapper.jsx";
import dispatch from "react-redux";
import styles from "./Board.module.css";
import { INITARTICLE } from "../redux/actions";

export default function Board(props) {
  const dispatch = useDispatch();

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  useEffect(() => {
    function checkArticleUpdate(uid) {
      db.collection("Articles")
        .orderBy("date", "desc")
        .where("uid", "==", uid)
        .onSnapshot(function (querySnapshot) {
          let list = [];
          querySnapshot.forEach(function (doc) {
            list.push({
              title: doc.data().title,
              content: doc.data().markDown.slice(100, 200),
              id: doc.data().id,
              tags: doc.data().tags,
              link: doc.data().link,
              readerHtml: doc.data().readerHtml,
            });
          });
          dispatch(INITARTICLE(list));
        });
    }
    if (user) {
      checkArticleUpdate(user.uid);
    }
  }, [user]);
  return (
    <div className={styles.boardWrapper}>
      <div className={styles.title}>Saved Article</div>
      <div className={styles.description}>
        The article you saved from web and RSS feed, read it anytime you want!
      </div>
      <CardWrapper />
    </div>
  );
}
